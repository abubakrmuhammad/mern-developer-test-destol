import parsedEnv from "@/env";
import ApiError from "@/lib/ApiError";
import catchAsync from "@/lib/catchAsync";
import { ValidRequest } from "@/lib/validateRequest";
import db from "@/prisma/db";
import { loginSchema } from "@/routes/schemas/auth.routes.schemas";
import { AuthenticatedRequest } from "@/types/shared";
import { createSendToken } from "@/utils";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = catchAsync(
  async (
    req: ValidRequest<typeof loginSchema>,
    res: Response,
    next: NextFunction,
  ) => {
    const { email, password: candidatePassword } = req.body;

    try {
      const user = await db.user.findFirst({
        where: { email },
      });

      if (!user) return next(new ApiError(401, "Incorrect Email or Password"));

      const isCorrectPassword = await bcrypt.compare(
        candidatePassword,
        user.password,
      );

      if (!isCorrectPassword)
        return next(new ApiError(401, "Incorrect Email or Password"));

      createSendToken(user, 200, req, res);
    } catch (error: any) {
      if (error instanceof ApiError) throw error;

      throw new ApiError(400, "Something went wrong when logging in");
    }
  },
);

export const getMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "You are not logged in");

    res.status(200).json({
      success: true,
      data: req.user,
    });
  },
);

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  const token = authorization?.startsWith("Bearer")
    ? authorization.split(" ")[1]
    : null;

  if (!token)
    return next(
      new ApiError(401, "You are not logged in! Please log in to get access."),
    );

  try {
    const decoded = jwt.verify(token, parsedEnv.JWT_SECRET) as {
      id: string;
    };

    const currentUser = await db.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser)
      return next(
        new ApiError(
          401,
          "The user belonging to this token does no longer exist.",
        ),
      );

    const { password, ...userWithoutPassword } = currentUser;

    (req as AuthenticatedRequest).user = userWithoutPassword;

    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token. Please log in again."));
  }
};
