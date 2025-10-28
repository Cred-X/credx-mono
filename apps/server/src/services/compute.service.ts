import { SolanaApi } from "@/lib/solana-rpc";
import { RedisClient } from "@/lib/redis";
import { compute_score } from "@/lib/utils/score-helper";
import { Context } from "hono";
import { WalletScore, WalletScoreError } from "@/types/score-compute";

export class ComputeService {
	public static computeScore = async ({
		ctx,
		walletAddress,
	}: {
		ctx: Context;
		walletAddress: string;
	}): Promise<WalletScore | WalletScoreError> => {
		const solana = SolanaApi.get_instance({
			api_key: ctx.env.SOLANA_API_KEY,
			rpc_url: ctx.env.SOLANA_RPC_URL,
		});
		const redis = RedisClient.getInstance({
			url: ctx.env.REDIS_URL,
			token: ctx.env.REDIS_TOKEN,
		}) as RedisClient;

		const score = await compute_score(solana, redis, walletAddress);

		if (!score) {
			throw new Error("Unable to compute score for the given wallet address.");
		}

		return score;
	};
}
