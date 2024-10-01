import { Response } from "express";
import parsedEnv from "@/env";
import { ValidRequest } from "@/lib/validateRequest";
import jwt from "jsonwebtoken";
import { loginSchema } from "./routes/schemas/auth.routes.schemas";
import { User } from "@prisma/client";

export function signTokenWithId(id: string) {
  return jwt.sign({ id }, parsedEnv.JWT_SECRET, {
    expiresIn: parsedEnv.JWT_EXPIRES_IN,
  });
}

export function createSendToken(
  user: User,
  statusCode: number,
  req: ValidRequest<typeof loginSchema>,
  res: Response,
) {
  const token = signTokenWithId(user.id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + parsedEnv.JWT_COOKIE_EXPIRES_IN!),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // @ts-expect-error password is not optional
  delete user.password;

  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
}
