import { z } from "zod";

const carsResponseSchemas = {
  upsertCar: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      id: z.string(),
      model: z.string(),
      price: z.number(),
      phoneNumber: z.string(),
      ownerId: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  }),
  getMyCar: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z
      .object({
        id: z.string(),
        model: z.string(),
        price: z.number(),
        phoneNumber: z.string(),
        ownerId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .nullable(),
  }),
};

export default carsResponseSchemas;
