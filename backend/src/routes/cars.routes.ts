import express from "express";
import validateRequest from "@/lib/validateRequest";
import {
  getMyCarSchema,
  uploadCarPicturesSchema,
  upsertCarSchema,
} from "./schemas/cars.routes.schemas";
import { protect } from "@/controllers/auth.controller";
import {
  getMyCar,
  uploadCarPictures,
  upsertCar,
} from "@/controllers/cars.controller";
import multer from "multer";
import * as mime from "mime-types";
import { nanoid } from "nanoid";

const carsRouter = express.Router();

carsRouter.get("/my", validateRequest(getMyCarSchema), protect, getMyCar);

carsRouter.post(
  "/upsert",
  validateRequest(upsertCarSchema),
  protect,
  upsertCar,
);

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/cars",
    filename(req, file, cb) {
      const id = nanoid();
      const ext = mime.extension(file.mimetype);
      cb(null, `${id}.${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

carsRouter.post(
  "/upload",
  validateRequest(uploadCarPicturesSchema),
  protect,
  upload.any(),
  uploadCarPictures,
);

export default carsRouter;
