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

const carsRouter = express.Router();

carsRouter.get("/my", validateRequest(getMyCarSchema), protect, getMyCar);

carsRouter.post(
  "/upsert",
  validateRequest(upsertCarSchema),
  protect,
  upsertCar,
);

const upload = multer({
  storage: multer.diskStorage({ destination: "./uploads" }),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

carsRouter.post(
  "/upload",
  validateRequest(uploadCarPicturesSchema),
  protect,
  upload.array("carPictures"),
  uploadCarPictures,
);

export default carsRouter;
