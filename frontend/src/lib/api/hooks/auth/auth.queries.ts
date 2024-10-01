import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/api.client";
import { AuthQueryKey } from "./auth.hooks.keys";

export function useGetMe() {
  return useQuery({
    queryKey: [AuthQueryKey.ME],
    queryFn: async () => {
      const response = await apiClient.auth.getMe();

      return response.data;
    },
  });
}
