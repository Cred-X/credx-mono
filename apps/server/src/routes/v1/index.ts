import { ComputeController } from "@/controller/compute.controller";
import { hono } from "@/lib/hono";
import { computeValidator } from "@/lib/validator/compute.validator";

export const v1Routes = hono();

v1Routes.post("/compute", computeValidator, ComputeController.compute_score);