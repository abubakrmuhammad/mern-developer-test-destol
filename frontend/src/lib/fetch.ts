/**
 * Wrapper around the native fetch API with additional features and type safety.
 *
 * @template T - The expected response type, defaults to 'json'.
 *
 * @param {string} path - The URL path for the request.
 * @param {Object} [options] - Additional options for the request.
 * @param {RequestMethod} [options.method='GET'] - The HTTP method to use.
 * @param {T} [options.responseType='json'] - The expected response type.
 *
 * @returns {Promise<FetchResponse<T>>} A promise that resolves to a FetchResponse object.
 *
 * @throws Throws the json response if the response is not ok (status outside 200-299 range).
 *
 * @description
 * This function extends the native fetch API with additional features:
 * - Automatically sets Content-Type header for non-GET requests.
 * - Supports various response types (json, text, blob, etc.).
 * - Provides a structured response object with metadata.
 * - Throws the json response if the response is not ok (status outside 200-299 range).
 * - Fully type-safe with TypeScript.
 */
async function $fetch<T extends ResponseType = "json">(
  path: string,
  options?: RequestInit & {
    method?: RequestMethod;
    responseType?: T;
  },
): Promise<FetchResponse<T>> {
  if (!options) options = { method: "GET" };
  if (!options.method) options.method = "GET";

  const headers = new Headers(options.headers);

  if (options.method !== "GET" && !headers.get("Content-Type"))
    headers.append("Content-Type", "application/json");

  const response = await fetch(`${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) throw await response.json();

  let res: unknown;

  switch (options.responseType) {
    case "arraybuffer":
      res = response.arrayBuffer();
      break;
    case "blob":
      res = response.blob();
      break;
    case "json":
      res = response.json();
      break;
    case "text":
      res = response.text();
      break;
    case "stream":
      res = response.body;
      break;
    case "formdata":
      res = response.formData();
      break;
    default:
      res = response.json();
  }

  const data = (await res) as ResponseData<T>;

  return {
    method: options.method,
    requestUrl: response.url,
    originalResponse: response,
    data,
  };
}

export default $fetch;

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ResponseType =
  | "arraybuffer"
  | "blob"
  | "json"
  | "text"
  | "stream"
  | "formdata";

export type ResponseData<T extends ResponseType> = T extends "json"
  ? unknown
  : T extends "text"
    ? string
    : T extends "arraybuffer"
      ? ArrayBuffer
      : T extends "blob"
        ? Blob
        : T extends "stream"
          ? ReadableStream<Uint8Array> | null
          : T extends "formdata"
            ? FormData
            : unknown;

export type FetchResponse<T extends ResponseType = "json"> = {
  method: RequestMethod;
  requestUrl: string;
  originalResponse: Response;
  data: ResponseData<T>;
};
