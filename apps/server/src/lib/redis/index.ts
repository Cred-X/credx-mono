import { Redis } from "@upstash/redis";

export class RedisClient extends Redis {
	private static instance: RedisClient;

	private constructor(connection: { url: string; token: string }) {
		super({
			url: connection.url,
			token: connection.token,
		});
	}

	public static readonly getInstance = ({
		url,
		token,
	}: {
		url: string;
		token: string;
	}): Redis => {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient({
				url,
				token,
			});
		}
		return RedisClient.instance;
	};
}