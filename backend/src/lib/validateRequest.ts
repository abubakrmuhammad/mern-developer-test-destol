import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema, ZodType } from "zod";
import ApiError from "./ApiError";
import { User } from "@prisma/client";

export type RouteSchema = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export type ValidRequest<T extends RouteSchema> = Request<
  T["params"] extends ZodType<infer P, any, any> ? P : unknown,
  unknown,
  T["body"] extends ZodType<infer B, any, any> ? B : unknown,
  T["query"] extends ZodType<infer Q, any, any> ? Q : unknown
>;

export interface AuthenticatedValidRequest<T extends RouteSchema>
  extends ValidRequest<T> {
  user: Omit<User, "password">;
}

function validateRequest(schema: RouteSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!schema) {
      throw new ApiError(500, "No request schema found for this route");
    }

    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, error.errors[0].message);
      }

      throw error;
    }
  };
}

export default validateRequest;
