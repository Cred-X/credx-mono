import { WalletScore, WalletScoreError } from "@/types/score-compute";
import { RedisClient } from "../redis";
import { UserStore } from "../redis/user";
import type { SolanaApi } from "../solana-rpc";

/**
 * WALLET CREDIT SCORING SYSTEM (0-100 scale)
 * ===========================================
 *
 * FORMULA: Score = (Transactions × 40%) + (Age × 40%) + (Assets × 20%)
 *
 * COMPONENTS:
 * -----------
 * 1. Transactions (40%): log₁₀(count) × 23
 *    - 10 txns → 23pts, 100 → 46pts, 1K → 69pts, 10K+ → 92-100pts
 *
 * 2. Age (40%): log₁₀(days+1) × 40 (first year), then 80 + log₁₀(years+1) × 20
 *    - 1 month → 35pts, 3 months → 56pts, 1 year → 80pts, 2+ years → 90-100pts
 *
 * 3. Assets (20% - SOFT FACTOR): √(count) × 20 with minimum boost
 *    - 0 → 0pts, 1 → 40pts, 5 → 65pts, 25 → 90pts, 100+ → 100pts
 *
 * RATING SCALE:
 * -------------
 * 81-100: Excellent | 61-80: Very Good | 41-60: Good | 21-40: Fair | 0-20: Poor
 *
 * KEY INSIGHT: Wallets can score 80/100 with ZERO assets if highly active and mature.
 * See CREDIT_SCORING_STANDARD.md for detailed documentation.
 */

const SCORE_WEIGHTS = {
	TRANSACTION: 0.4,
	AGE: 0.4,
	ASSETS: 0.2,
} as const;

const TRANSACTION_MULTIPLIER = 23;
const AGE_FIRST_YEAR_MULTIPLIER = 40;
const AGE_AFTER_YEAR_BASE = 80;
const AGE_AFTER_YEAR_MULTIPLIER = 20;
const DAYS_IN_YEAR = 365;
const SECONDS_IN_DAY = 86400;

const ASSET_MIN_SCORE = 40;
const ASSET_LOW_MULTIPLIER = 12;
const ASSET_MULTIPLIER = 20;
const ASSET_LOW_THRESHOLD = 5;

const MAX_SCORE = 100;
const MIN_SCORE = 0;

/**
 * Clamps a score value between MIN_SCORE and MAX_SCORE.
 * @param score The score to clamp.
 * @returns The clamped score (0-100).
 */
const clampScore = (score: number): number => {
	if (!Number.isFinite(score)) return MIN_SCORE;
	return Math.round(Math.max(MIN_SCORE, Math.min(MAX_SCORE, score)));
};

/**
 * Get the score of a wallet based on the number of transactions.
 * Formula: log₁₀(count) × 23, capped at 100
 *
 * @param solana The Solana API instance.
 * @param walletAddress The wallet address to get the score for.
 * @returns The score of the wallet according to the number of transactions (0-100).
 */
const get_score_by_tnx = async (
	solana: SolanaApi,
	walletAddress: string
): Promise<number> => {
	try {
		const { result } = await solana.get_transactions_by_address(walletAddress);
		const transactionCount = result?.length ?? 0;

		if (transactionCount === 0) return MIN_SCORE;

		const score = Math.log10(transactionCount) * TRANSACTION_MULTIPLIER;
		return clampScore(score);
	} catch (error) {
		console.error("[get_score_by_tnx] Error:", error);
		return MIN_SCORE;
	}
};

/**
 * Get the score of a wallet based on its age (time since first transaction).
 * Formula: log₁₀(days+1) × 40 (first year), then 80 + log₁₀(years+1) × 20
 *
 * @param solana The Solana API instance.
 * @param walletAddress The wallet address to get the score for.
 * @returns The score of the wallet according to its age (0-100).
 */
const get_score_by_age = async (
	solana: SolanaApi,
	walletAddress: string
): Promise<number> => {
	try {
		const { result } = await solana.get_first_transaction_signature(
			walletAddress
		);

		const blockTime = result?.[0]?.blockTime;
		if (!blockTime || !Number.isFinite(blockTime)) return MIN_SCORE;

		const currentTime = Math.floor(Date.now() / 1000);
		const ageInDays = (currentTime - blockTime) / SECONDS_IN_DAY;

		if (ageInDays <= 0) return MIN_SCORE;

		const score =
			ageInDays < DAYS_IN_YEAR
				? Math.log10(ageInDays + 1) * AGE_FIRST_YEAR_MULTIPLIER
				: AGE_AFTER_YEAR_BASE +
				  Math.log10(ageInDays / DAYS_IN_YEAR + 1) * AGE_AFTER_YEAR_MULTIPLIER;

		return clampScore(score);
	} catch (error) {
		console.error("[get_score_by_age] Error:", error);
		return MIN_SCORE;
	}
};

/**
 * Get the score of a wallet based on its assets (NFTs, tokens, etc.).
 * Formula: √(count) × 20, with special handling for low counts (1-5 assets)
 * SOFT FACTOR (20% weight) - zero assets is acceptable.
 *
 * @param solana The Solana API instance.
 * @param walletAddress The wallet address to get the score for.
 * @returns The score of the wallet according to its assets (0-100).
 */
const get_score_by_assets = async (
	solana: SolanaApi,
	walletAddress: string
): Promise<number> => {
	try {
		const { result } = await solana.get_assets(walletAddress);
		const assetCount = result?.total ?? 0;

		if (assetCount === 0) return MIN_SCORE;

		const score =
			assetCount === 1
				? ASSET_MIN_SCORE
				: assetCount <= ASSET_LOW_THRESHOLD
				? ASSET_MIN_SCORE + Math.sqrt(assetCount) * ASSET_LOW_MULTIPLIER
				: Math.sqrt(assetCount) * ASSET_MULTIPLIER;

		return clampScore(score);
	} catch (error) {
		console.error("[get_score_by_assets] Error:", error);
		return MIN_SCORE;
	}
};

/**
 * Compute the final credit score of a wallet.
 *
 * Score = (Transactions × 0.40) + (Age × 0.40) + (Assets × 0.20)
 *
 * All component scores are calculated in parallel for optimal performance.
 * Returns 0-100 (rounded integer).
 *
 * @param solana The Solana API instance.
 * @param walletAddress The wallet address to compute the score for.
 * @returns The computed credit score of the wallet (0-100).
 */

export const compute_score = async (
	solana: SolanaApi,
	redis: RedisClient,
	walletAddress: string
): Promise<WalletScore | WalletScoreError> => {
	try {
		const userStore = UserStore.getInstance({ redis });

		const existingScore = await userStore.getUserScore(walletAddress);
		if (existingScore) {
			return {
				final_score: existingScore.final_score,
				tnx_score: existingScore.tnx_score,
				age_score: existingScore.age_score,
				assets_score: existingScore.assets_score,
			};
		}

		const [txScore, ageScore, assetsScore] = await Promise.all([
			get_score_by_tnx(solana, walletAddress),
			get_score_by_age(solana, walletAddress),
			get_score_by_assets(solana, walletAddress),
		]);

		const finalScore =
			txScore * SCORE_WEIGHTS.TRANSACTION +
			ageScore * SCORE_WEIGHTS.AGE +
			assetsScore * SCORE_WEIGHTS.ASSETS;

		const roundedFinalScore = Math.round(finalScore);

		await userStore.setUserScore(walletAddress, {
			tnx_score: txScore,
			age_score: ageScore,
			assets_score: assetsScore,
			final_score: roundedFinalScore,
		});

		return {
			final_score: roundedFinalScore,
			tnx_score: txScore,
			age_score: ageScore,
			assets_score: assetsScore,
		};
	} catch (error) {
		console.error("[compute_score] Error:", error);
		return {
			error: error instanceof Error ? error.message : "Unknown error",
			final_score: MIN_SCORE,
		};
	}
};
