import { z } from "zod";

export const cartProductSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number().int().nonnegative(),
  total: z.coerce.number(),
  discountPercentage: z.coerce.number(),
  discountedTotal: z.coerce.number().optional(),
  thumbnail: z.string(),
});

export const cartSchema = z.object({
  id: z.coerce.number().int().positive(),
  products: z.array(cartProductSchema),
  total: z.coerce.number(),
  discountedTotal: z.coerce.number(),
  userId: z.coerce.number().int().positive(),
  totalProducts: z.coerce.number().int().nonnegative(),
  totalQuantity: z.coerce.number().int().nonnegative(),
});

export const cartsListResponseSchema = z.object({
  carts: z.array(cartSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export type Cart = z.infer<typeof cartSchema>;
export type CartsListResponse = z.infer<typeof cartsListResponseSchema>;
