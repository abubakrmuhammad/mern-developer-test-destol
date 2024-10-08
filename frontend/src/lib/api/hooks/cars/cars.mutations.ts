import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/api.client";
import { UpserCarParams } from "@/lib/api/requests/cars/cars.requests.types";

export function useUpsertCar() {
  return useMutation({
    mutationFn: async (params: UpserCarParams) => {
      const response = await apiClient.cars.upsertCar(params);

      return response;
    },
  });
}

export function useUploadCarImages() {
  return useMutation({
    mutationFn: async (params: File[]) => {
      const response = await apiClient.cars.uploadCarPictures({
        images: params,
      });

      return response;
    },
  });
}
