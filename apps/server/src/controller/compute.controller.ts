import { api_response } from "@/lib/utils/api-response";
import { validateEnvironment } from "@/lib/utils/env-validator";
import { ComputeSchema } from "@/lib/validator/compute.validator";
import { ComputeService } from "@/services/compute.service";
import { Context } from "hono";

export class ComputeController {
	public static compute_score = async (ctx: Context) => {
		try {
			const { isValid, missingVars } = validateEnvironment(ctx);

			if (!isValid) {
				return ctx.json(
					api_response({
						message: `Missing required environment variables: ${missingVars.join(
							", "
						)}`,
						is_error: true,
					}),
					409
				);
			}

			// @ts-ignore
			const data: ComputeSchema = ctx.req.valid("json");

			const score = ComputeService.computeScore({
				ctx,
				walletAddress: data.wallet_address,
			});

			return ctx.json(
				api_response({
					data: {
						wallet_address: data.wallet_address,
						score: await score,
					},
					message: "Score computed successfully",
					is_error: false,
				}), 200
			);
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(
					api_response({
						message: error.message,
						is_error: true,
					}), 500
				);
			}
		}
	};
}
