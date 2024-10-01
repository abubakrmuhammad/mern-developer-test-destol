import { z } from "zod";

export const loginSchema = {
  body: z.object({
    email: z
      .string({
        required_error: "Please provide your email.",
      })
      .toLowerCase()
      .email("Please provide a valid email"),
    password: z.string({
      required_error: "Please provide your password.",
    }),
  }),
};

export const getMeSchema = {};
