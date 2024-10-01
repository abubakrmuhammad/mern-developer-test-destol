import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/api.client";
import { CarsQueryKey } from "./cars.hooks.keys";

export function useGetMyCar() {
  return useQuery({
    queryKey: [CarsQueryKey.MY_CAR],
    queryFn: async () => {
      const response = await apiClient.cars.getMyCar();

      return response.data;
    },
  });
}
