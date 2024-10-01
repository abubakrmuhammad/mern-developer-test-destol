import { BACKEND_API_BASE_URL, parseResponseData } from "@/lib/utils";
import { LoginRequestParams } from "./auth.requests.types";
import $fetch from "@/lib/fetch";
import authResponseSchemas from "./auth.responses.schemas";

const BASE_SERVICE_URL = `${BACKEND_API_BASE_URL}/auth` as const;

export async function login(params: LoginRequestParams) {
  const response = await $fetch(`${BASE_SERVICE_URL}/login`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  const data = parseResponseData(response, authResponseSchemas.login);

  return data;
}
