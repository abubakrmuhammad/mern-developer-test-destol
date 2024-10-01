import { env } from "@/env";
import { UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";
import { FetchResponse, ResponseData } from "./fetch";

export const BACKEND_HOSTNAME = env.NEXT_PUBLIC_BACKEND_API_URL;
export const BACKEND_API_BASE_URL = `${BACKEND_HOSTNAME}/api/v1` as const;

/**
 * Parses the response data from a fetch request and validates it against the provided schema.
 *
 * @param response - The json response object from a fetch request.
 * @param schema - The Zod schema to validate the response data against.
 *
 * @returns The parsed and validated response data as a readonly object.
 *
 * @throws {Error} If the response data fails to validate against the provided schema.
 */
export function parseResponseData<T extends z.AnyZodObject>(
  response: FetchResponse<"json">,
  schema: T,
): Readonly<z.infer<T>> {
  try {
    const parsedResponse = schema.parse(response.data);

    return parsedResponse as Readonly<z.infer<T>>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.format();

      console.error(
        `Schema validation failed for ${response.method} request: ${response.requestUrl}`,
        { cause: formattedErrors },
      );
    }

    return response.data as Readonly<z.infer<T>>;
  }
}

/**
 * The default schema of an error response from an IOT-API request using the kaena context.
 */
const defaultApiErrorSchema = z.object({
  success: z.boolean(),
  status: z.string(),
  message: z.string(),
});

/**
 * Parses the error message from a fetch request and validates it against the provided schema (uses the default schema if none is provided).
 *
 * @param error - The json error object from a fetch request.
 * @param schema - The Zod schema to validate the error message against. Uses the default schema if none is provided.
 *
 * @returns The parsed and validated error message as a string or `null` if the error response does not match the provided schema.
 *
 * @example
 * ```
 * try {
 *   const response = await $fetch('iot-api/api/v1/car/1234567890/');
 *   // ...
 * } catch (error) {
 *   const errorMessage = parseApiErrorMessage(error);
 *   console.log(errorMessage); // "Invalid credentials" || `null`
 * }
 * ```
 */
export function parseApiErrorMessage(
  error: ResponseData<"json">,
  schema: z.AnyZodObject = defaultApiErrorSchema,
): string | null {
  try {
    const parsedError = schema.parse(error);

    return parsedError.message;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.format();

      console.error(`Schema validation failed for api error message: `, {
        cause: formattedErrors,
      });
    }

    return null;
  }
}

/**
 * Returns the type of query data from a useQuery result.
 *
 * @param result - The useQuery result.
 *
 * @returns The query data type from the useQuery result.
 *
 * @example
 * ```
 * const result = useSimCardDetail({ iccid: '1234567890' });
 *
 * QueryData<typeof useSimCardDetail>; // SimCardType
 * ```
 */
export type QueryData<T extends (...args: any) => any> =
  ReturnType<T> extends UseQueryResult<infer R, any> ? R : never;
