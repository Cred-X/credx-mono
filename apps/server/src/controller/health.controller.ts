import { Context } from "hono";
import { api_response } from "@/lib/utils/api-response";
import { HealthService } from "@/services/health.service";

export class HealthController {
	public static readonly healthCheck = (ctx: Context) => {
		const healthStatus = HealthService.healthCheck();
		return ctx.json(
			api_response({
				data: healthStatus,
				message: "Health check successful",
				is_error: false,
			}),
			200
		);
	};
}
