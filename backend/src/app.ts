import express from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import apiErrorHandler from "@/lib/errorHandler";
import authRouter from "@/routes/auth.routes";
import compression from "compression";
import carsRouter from "./routes/cars.routes";

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));

app.use(morgan("dev"));

app.use(
  "/api/*",
  cors({
    origin: true,
    credentials: true,
  }),
);
app.options(
  "/api/*",
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(compression());

app.get("/", (req, res) => {
  res.send("Hello 👋🏼!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cars", carsRouter);

// @ts-expect-error express type defs suck
app.use(apiErrorHandler);

export default app;
