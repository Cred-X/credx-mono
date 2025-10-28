import { Env } from "@/types/bindings";
import { Hono } from "hono";

export const hono = () => new Hono<{ Bindings: Env;}>();
