import { z } from "zod";

const authResponseSchemas = {
  login: z.object({
    success: z.boolean(),
    status: z.string(),
    message: z.string(),
    data: z.object({
      token: z.string(),
      user: z.object({
        id: z.string(),
        username: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        isActive: z.boolean(),
        isAdmin: z.boolean(),
      }),
    }),
  }),
};

export default authResponseSchemas;
