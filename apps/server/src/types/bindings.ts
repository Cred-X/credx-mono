import { DbType } from "./db";

export interface Env {
	TURSO_DATABASE_URL: string;
	TURSO_AUTH_TOKEN: string;
	FRONTEND_URL: string;
	REDIS_URL: string;
	REDIS_TOKEN: string;
	SOLANA_RPC_URL: string;
	SOLANA_API_KEY: string;
}