import { cartSchema, cartsListResponseSchema } from "./contracts";
import type { Cart, CartsListResponse } from "./contracts";
import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

export interface CartsListInput {
  page: number;
  pageSize: number;
  userId?: number | undefined;
}

export async function getCarts(input: CartsListInput, signal: AbortSignal): Promise<CartsListResponse> {
  const params = { limit: input.pageSize, skip: (input.page - 1) * input.pageSize };
  const endpoint = input.userId ? `/carts/user/${input.userId}` : "/carts";
  const response = await httpClient.get(endpoint, { params, signal });
  const result = cartsListResponseSchema.safeParse(response.data);
  if (!result.success) {
    throw new ApplicationError("Invalid carts response", {
      code: "API_CONTRACT_ERROR",
      details: result.error.flatten(),
      cause: result.error,
    });
  }
  return result.data;
}

export async function getCart(cartId: number, signal: AbortSignal): Promise<Cart> {
  const response = await httpClient.get(`/carts/${cartId}`, { signal });
  const result = cartSchema.safeParse(response.data);
  if (!result.success) {
    throw new ApplicationError("Invalid cart response", {
      code: "API_CONTRACT_ERROR",
      details: result.error.flatten(),
      cause: result.error,
    });
  }
  return result.data;
}
