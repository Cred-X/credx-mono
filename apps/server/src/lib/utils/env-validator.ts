import { Context } from "hono";

export const validateEnvironment = (ctx: Context) => {
	try {
		const missingVars = [];

		if (!ctx.env.REDIS_URL) missingVars.push("REDIS_URL");
		if (!ctx.env.REDIS_TOKEN) missingVars.push("REDIS_TOKEN");
		if (!ctx.env.SOLANA_RPC_URL) missingVars.push("SOLANA_RPC_URL");
		if (!ctx.env.FRONTEND_URL) missingVars.push("FRONTEND_URL");
		if (!ctx.env.SOLANA_API_KEY) missingVars.push("SOLANA_API_KEY");

		if (missingVars.length > 0) {
			throw new Error(
				`Missing required environment variables: ${missingVars.join(", ")}`
			);
		}

		return {
			isValid: true,
			missingVars: [],
		};
	} catch (error) {
		throw error;
	}
};
