import { z } from "zod";

export const compute_schema = z.object({
	wallet_address: z
		.string()
		.min(1)
		.trim()
		.regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid Solana address"),
});

export type ComputeSchema = z.infer<typeof compute_schema>;
