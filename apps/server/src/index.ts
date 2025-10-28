import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { apiRoutes } from "./routes";
import { hono } from "./lib/hono";

const app = hono();

app.use(logger());
app.use(prettyJSON());
app.use("*", async (ctx, next) => {
	const corsMiddleware = cors({
		credentials: true,
		origin: ["http://localhost:3000", ctx.env.FRONTEND_URL],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	});
	return corsMiddleware(ctx, next);
});

app.route("/api", apiRoutes);

showRoutes(app);

export default app;
