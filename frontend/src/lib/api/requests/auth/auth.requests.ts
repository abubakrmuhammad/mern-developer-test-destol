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

export async function logout() {
  const response = await $fetch(`${BASE_SERVICE_URL}/logout`);

  const data = parseResponseData(response, authResponseSchemas.logout);

  return data;
}

export async function getMe() {
  const response = await $fetch(`${BASE_SERVICE_URL}/me`);

  const data = parseResponseData(response, authResponseSchemas.getMe);

  return data;
}
