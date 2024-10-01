import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/api.client";
import { LoginRequestParams } from "@/lib/api/requests/auth/auth.requests.types";

export function useLogin() {
  return useMutation({
    mutationFn: async (params: LoginRequestParams) => {
      const response = await apiClient.auth.login(params);

      return response;
    },
  });
}
