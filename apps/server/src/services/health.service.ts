export class HealthService {
	public static readonly healthCheck = () => {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
		};
	};
}
