import { DbType } from "./db";

export interface Env {
	FRONTEND_URL: string;
	REDIS_URL: string;
	REDIS_TOKEN: string;
	SOLANA_RPC_URL: string;
	SOLANA_API_KEY: string;
}