import express from "express";
import validateRequest from "@/lib/validateRequest";
import {
  getMeSchema,
  loginSchema,
  logoutSchema,
} from "./schemas/auth.routes.schemas";
import { getMe, login, logout } from "@/controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", validateRequest(loginSchema), login);

authRouter.get("/logout", validateRequest(logoutSchema), logout);

authRouter.get("/me", validateRequest(getMeSchema), getMe);

export default authRouter;
