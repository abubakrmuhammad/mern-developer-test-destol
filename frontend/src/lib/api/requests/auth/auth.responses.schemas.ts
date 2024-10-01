import { z } from "zod";

const authResponseSchemas = {
  login: z.object({
    success: z.boolean(),
    token: z.string(),
    data: z.object({
      id: z.string(),
      email: z.string(),
      createdAt: z.string(),
    }),
  }),
  logout: z.object({
    success: z.boolean(),
  }),
  getMe: z.object({
    success: z.boolean(),
    data: z.object({
      id: z.string(),
      email: z.string(),
      createdAt: z.string(),
    }),
  }),
};

export default authResponseSchemas;
