import { queryOptions } from "@tanstack/react-query";

import { getCart, getCarts } from "./client";
import type { CartsListInput } from "./client";

export const cartsKeys = {
  all: ["carts"] as const,
  lists: () => [...cartsKeys.all, "list"] as const,
  list: (input: CartsListInput) => [...cartsKeys.lists(), input] as const,
  details: () => [...cartsKeys.all, "detail"] as const,
  detail: (cartId: number) => [...cartsKeys.details(), cartId] as const,
};

export function cartsListQueryOptions(input: CartsListInput) {
  return queryOptions({ queryKey: cartsKeys.list(input), queryFn: ({ signal }) => getCarts(input, signal), staleTime: 60_000 });
}

export function cartDetailQueryOptions(cartId: number) {
  return queryOptions({ queryKey: cartsKeys.detail(cartId), queryFn: ({ signal }) => getCart(cartId, signal) });
}

export type { CartsListInput } from "./client";
