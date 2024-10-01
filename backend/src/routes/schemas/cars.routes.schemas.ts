import { z } from "zod";

export const upsertCarSchema = {
  body: z.object({
    model: z
      .string({
        required_error: "Please provide your car model.",
      })
      .min(3, "Car model should be at least 3 characters long.")
      .max(255, "Car model should be at most 255 characters long."),
    price: z
      .number({
        required_error: "Please provide the price of your car.",
      })
      .min(1, "Price should be at least 1 dollar.")
      .max(1000000, "Price should be at most 1000000 dollars."),
    phoneNumber: z
      .string({
        required_error: "Please provide your phone number.",
      })
      .length(11, "Phone number should be 11 digits long."),
  }),
};

export const getMyCarSchema = {};

export const uploadCarPicturesSchema = {};
