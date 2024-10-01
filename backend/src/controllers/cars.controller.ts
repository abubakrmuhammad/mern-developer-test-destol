import ApiError from "@/lib/ApiError";
import catchAsync from "@/lib/catchAsync";
import { AuthenticatedValidRequest } from "@/lib/validateRequest";
import db from "@/prisma/db";
import {
  getMyCarSchema,
  uploadCarPicturesSchema,
  upsertCarSchema,
} from "@/routes/schemas/cars.routes.schemas";
import { Response } from "express";

export const upsertCar = catchAsync(
  async (
    req: AuthenticatedValidRequest<typeof upsertCarSchema>,
    res: Response,
  ) => {
    const { model, price, phoneNumber } = req.body;
    const userId = req.user.id;

    try {
      const car = await db.car.upsert({
        where: { ownerId: userId },
        create: { model, price, phoneNumber, ownerId: userId },
        update: { model, price, phoneNumber },
      });

      return res.status(200).json({
        success: true,
        message: "Car successfully updated",
        data: car,
      });
    } catch (error: any) {
      if (error instanceof ApiError) throw error;

      throw new ApiError(400, "Something went wrong when logging in");
    }
  },
);

export const getMyCar = catchAsync(
  async (
    req: AuthenticatedValidRequest<typeof getMyCarSchema>,
    res: Response,
  ) => {
    const userId = req.user.id;

    try {
      const car = await db.car.findUnique({
        where: { ownerId: userId },
        include: { images: true },
      });

      return res.status(200).json({
        success: true,
        message: "Car successfully retrieved",
        data: car,
      });
    } catch (error: any) {
      if (error instanceof ApiError) throw error;

      throw new ApiError(400, "Something went wrong when retrieving car");
    }
  },
);

export const uploadCarPictures = catchAsync(
  async (
    req: AuthenticatedValidRequest<typeof uploadCarPicturesSchema>,
    res: Response,
  ) => {
    const carPictures = req.files as Express.Multer.File[];
    const userId = req.user.id;

    try {
      const car = await db.car.findUnique({
        where: { ownerId: userId },
      });

      if (!car) throw new ApiError(400, "You don't have a car yet");

      await db.carImage.createMany({
        data: carPictures.map((file) => ({
          url: file.path,
          carId: car.id,
        })),
      });

      const carWithImages = await db.car.findUnique({
        where: { id: car.id },
        include: { images: true },
      });

      return res.status(200).json({
        success: true,
        message: "Car successfully updated",
        data: carWithImages,
      });
    } catch (error: any) {
      if (error instanceof ApiError) throw error;

      throw new ApiError(400, "Something went wrong when retrieving car");
    }
  },
);
