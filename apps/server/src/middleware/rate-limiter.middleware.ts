import { Context, Next } from "hono";
import { RedisClient } from "../lib/redis";
import { Env } from "../types/bindings";
import { api_response } from "@/lib/utils/api-response";

interface RateLimiterOptions {
	maxRequests: number;
	windowSeconds: number;
	keyGenerator?: (ctx: Context) => string;
	skip?: (ctx: Context) => boolean;
	message?: string;
}

/**
 * Default key generator using IP address
 */
const defaultKeyGenerator = (ctx: Context): string => {
	// Try to get real IP from headers (for proxies/load balancers)
	const forwardedFor = ctx.req.header("X-Forwarded-For");
	const realIp = ctx.req.header("X-Real-IP");
	const cfConnectingIp = ctx.req.header("CF-Connecting-IP");

	const ip =
		cfConnectingIp ||
		realIp ||
		(forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
		"unknown";

	return ip;
};

/**
 * Key generator using user ID (requires authentication)
 */
const userIdKeyGenerator = (ctx: Context): string => {
	const user = ctx.get("user");
	return user?.id ? `user:${user.id}` : defaultKeyGenerator(ctx);
};

/**
 * Key generator using API path
 */
const pathKeyGenerator = (ctx: Context): string => {
	const ip = defaultKeyGenerator(ctx);
	const path = ctx.req.path;
	return `${ip}:${path}`;
};


/**
 * Rate limiter middleware using Redis for distributed rate limiting
 * Uses sliding window algorithm for accurate rate limiting
 */
export const rateLimiter = (options: RateLimiterOptions) => {
	const {
		maxRequests,
		windowSeconds,
		keyGenerator = userIdKeyGenerator,
		skip,
		message = "Too many requests, please try again later.",
	} = options;

	return async (ctx: Context<{ Bindings: Env }>, next: Next) => {
		if (skip && skip(ctx)) {
			return next();
		}

		const redis = RedisClient.getInstance({
			url: ctx.env.REDIS_URL,
			token: ctx.env.REDIS_TOKEN,
		});

		const key = keyGenerator(ctx);
		const redisKey = `rate_limit:${key}`;

		const now = Date.now();
		const windowStart = now - windowSeconds * 1000;

		try {
			const pipeline = redis.pipeline();
			pipeline.zremrangebyscore(redisKey, 0, windowStart);
			pipeline.zcard(redisKey);
			pipeline.zadd(redisKey, { score: now, member: `${now}` });
			pipeline.expire(redisKey, windowSeconds);
			const results = await pipeline.exec();
			const requestCount = (results[1] as number) || 0;
			if (requestCount >= maxRequests) {
				const oldestEntry = await redis.zrange(redisKey, 0, 0, {
					withScores: true,
				});
				const retryAfter =
					oldestEntry.length > 0
						? Math.ceil(
								(Number(oldestEntry[1]) + windowSeconds * 1000 - now) / 1000
						  )
						: windowSeconds;
				ctx.header("X-RateLimit-Limit", maxRequests.toString());
				ctx.header("X-RateLimit-Remaining", "0");
				ctx.header("X-RateLimit-Reset", String(now + retryAfter * 1000));
				ctx.header("Retry-After", retryAfter.toString());

				return ctx.json(
					api_response({
						message,
						is_error: true,
						data: retryAfter,
					}),
					429
				);
			}

			// Set rate limit headers
			const remaining = maxRequests - requestCount - 1;
			ctx.header("X-RateLimit-Limit", maxRequests.toString());
			ctx.header("X-RateLimit-Remaining", remaining.toString());
			ctx.header("X-RateLimit-Reset", String(now + windowSeconds * 1000));

			return next();
		} catch (error) {
			// Log error but don't block request if Redis fails
			console.error("Rate limiter error:", error);
			return next();
		}
	};
};
