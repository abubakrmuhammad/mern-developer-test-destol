import { BACKEND_API_BASE_URL, parseResponseData } from "@/lib/utils";
import $fetch from "@/lib/fetch";
import { UpserCarParams } from "./cars.requests.types";
import carsResponseSchemas from "./cars.responses.schemas";

const BASE_SERVICE_URL = `${BACKEND_API_BASE_URL}/cars` as const;

export async function upsertCar(params: UpserCarParams) {
  const response = await $fetch(`${BASE_SERVICE_URL}/upsert`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  const data = parseResponseData(response, carsResponseSchemas.upsertCar);

  return data;
}

export async function getMyCar() {
  const response = await $fetch(`${BASE_SERVICE_URL}/my`);

  const data = parseResponseData(response, carsResponseSchemas.getMyCar);

  return data;
}
