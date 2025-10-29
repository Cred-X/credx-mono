import { RedisClient } from ".";

export interface UserScoreData {
	tnx_score: number;
	age_score: number;
	assets_score: number;
	final_score: number;
}

export class UserStore {
	private static instance: UserStore;
	private redis: RedisClient;
	private readonly CACHE_EXPIRY = 300; // 5 min in seconds
	private readonly SCORE_PREFIX = "score:";

	private constructor(redisClient: RedisClient) {
		this.redis = redisClient;
	}

	public static readonly getInstance = ({
		redis,
	}: {
		redis: RedisClient;
	}): UserStore => {
		if (!UserStore.instance) {
			UserStore.instance = new UserStore(redis);
		}
		return UserStore.instance;
	};

	private getScoreKey(walletAddress: string): string {
		return `${this.SCORE_PREFIX}${walletAddress}`;
	}

	async getUserScore(walletAddress: string): Promise<UserScoreData | null> {
		try {
			if (!walletAddress?.trim()) {
				console.warn(
					"[UserStore] Invalid wallet address provided to getUserScore"
				);
				return null;
			}

			const cachedScore = await this.redis.get<UserScoreData>(
				this.getScoreKey(walletAddress)
			);
			return cachedScore;
		} catch (error) {
			console.error(
				`[UserStore] Error getting score for ${walletAddress}:`,
				error instanceof Error ? error.message : String(error)
			);
			return null;
		}
	}

	async getFinalScore(walletAddress: string): Promise<number | null> {
		try {
			const scoreData = await this.getUserScore(walletAddress);
			return scoreData?.final_score ?? null;
		} catch (error) {
			console.error(
				`[UserStore] Error getting final score for ${walletAddress}:`,
				error instanceof Error ? error.message : String(error)
			);
			return null;
		}
	}

	async setUserScore(
		walletAddress: string,
		scoreData: UserScoreData,
		expirySeconds?: number
	): Promise<void> {
		try {
			if (!walletAddress?.trim()) {
				console.warn(
					"[UserStore] Invalid wallet address provided to setUserScore"
				);
				return;
			}

			if (!scoreData || typeof scoreData.final_score !== "number") {
				console.warn("[UserStore] Invalid score data provided to setUserScore");
				return;
			}

			await this.redis.set(this.getScoreKey(walletAddress), scoreData, {
				ex: expirySeconds ?? this.CACHE_EXPIRY,
			});
		} catch (error) {
			console.error(
				`[UserStore] Error setting score for ${walletAddress}:`,
				error instanceof Error ? error.message : String(error)
			);
		}
	}

	async deleteUserScore(walletAddress: string): Promise<boolean> {
		try {
			if (!walletAddress?.trim()) {
				console.warn(
					"[UserStore] Invalid wallet address provided to deleteUserScore"
				);
				return false;
			}

			const key = this.getScoreKey(walletAddress);
			const result = await this.redis.del(key);
			return result > 0;
		} catch (error) {
			console.error(
				`[UserStore] Error deleting score for ${walletAddress}:`,
				error instanceof Error ? error.message : String(error)
			);
			return false;
		}
	}

	async hasUserScore(walletAddress: string): Promise<boolean> {
		try {
			if (!walletAddress?.trim()) {
				console.warn(
					"[UserStore] Invalid wallet address provided to hasUserScore"
				);
				return false;
			}

			const key = this.getScoreKey(walletAddress);
			const exists = await this.redis.exists(key);
			return exists > 0;
		} catch (error) {
			console.error(
				`[UserStore] Error checking existence for ${walletAddress}:`,
				error instanceof Error ? error.message : String(error)
			);
			return false;
		}
	}
}
