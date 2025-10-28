import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { apiRoutes } from "./routes";
import { hono } from "./lib/hono";

const app = hono();

app.use(logger());
app.use("*", async (c, next) => {
	const corsMiddleware = cors({
		credentials: true,
		origin: ["http://localhost:3000"],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	});
	return corsMiddleware(c, next);
});
app.use(prettyJSON());

app.route("/api", apiRoutes);

showRoutes(app);

export default app;
