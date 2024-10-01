import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/api.client";
import { LoginRequestParams } from "@/lib/api/requests/auth/auth.requests.types";
import { useJwtLocalStorage } from "@/lib/utils";

export function useLogin() {
  const { setToken } = useJwtLocalStorage();

  return useMutation({
    mutationFn: async (params: LoginRequestParams) => {
      const response = await apiClient.auth.login(params);

      return response;
    },
    onSuccess(data) {
      setToken(data.token);
    },
  });
}
