import { hono } from "@/lib/hono";
import { v1Routes } from "./v1";
import { HealthController } from "@/controller/health.controller";

export const apiRoutes = hono();

apiRoutes.get("/health", HealthController.healthCheck);

apiRoutes.route('/v1', v1Routes);