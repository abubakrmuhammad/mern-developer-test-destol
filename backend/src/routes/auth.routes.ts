import express from "express";
import validateRequest from "@/lib/validateRequest";
import { getMeSchema, loginSchema } from "./schemas/auth.routes.schemas";
import { getMe, login, protect } from "@/controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", validateRequest(loginSchema), login);

authRouter.get("/me", validateRequest(getMeSchema), protect, getMe);

export default authRouter;
