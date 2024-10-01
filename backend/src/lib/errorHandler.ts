import parsedEnv from "@/env";
import consola from "consola";
import { NextFunction, Request, Response } from "express";
import ApiError from "./ApiError";

function apiErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    if (parsedEnv.NODE_ENV === "development") {
      consola.error(`⛔️ REQUEST FAILED - ${err.message} ⛔️`);
      consola.error(err);
    }

    const { status, message, statusCode } = err;

    return res.status(statusCode).json({
      success: false,
      status,
      message,
    });
  }

  consola.error(`💥 AN ERROR OCCURRED 💥`);
  consola.error(err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong",
  });
}

export default apiErrorHandler;
