import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { api_response } from "../utils/api-response";

const compute_schema = z.object({
  wallet_address: z
    .string()
    .min(1)
    .trim()
    .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid Solana address"),
});

export const computeValidator = zValidator("json", compute_schema, (result, ctx) => {
	if (!result.success) {
    const r = result.error
		return ctx.json(
			api_response({
        message: result.error || "invalid address provided",
        is_error: true
      }),
			400
		);
	}
});

export type ComputeSchema = z.infer<typeof compute_schema>;