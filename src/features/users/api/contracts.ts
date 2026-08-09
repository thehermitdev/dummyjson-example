import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "moderator", "user"]);

export const userSchema = z.object({
  id: z.coerce.number().int().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  maidenName: z.string().optional().default(""),
  age: z.coerce.number().int().nonnegative(),
  gender: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  username: z.string().min(1),
  image: z.url(),
  hair: z.object({
    color: z.string().min(1),
    type: z.string().min(1),
  }),
  company: z.object({
    department: z.string().min(1),
    name: z.string().min(1),
    title: z.string().min(1),
  }),
  role: userRoleSchema,
});

export const usersListResponseSchema = z.object({
  users: z.array(userSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const userOptionSchema = userSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  image: true,
});

export const usersDirectoryResponseSchema = z.object({
  users: z.array(userOptionSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const createUserInputSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim().min(1),
  age: z.coerce.number().int().min(18).max(120),
  gender: z.enum(["female", "male"]),
  role: userRoleSchema,
  department: z.string().trim().min(1),
  title: z.string().trim().min(1),
});

export const updateUserInputSchema = createUserInputSchema.partial();

export const deletedUserSchema = userSchema.extend({
  isDeleted: z.boolean(),
  deletedOn: z.string(),
});

const relationPostSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  reactions: z.object({ likes: z.coerce.number(), dislikes: z.coerce.number() }),
  views: z.coerce.number().optional().default(0),
  userId: z.coerce.number().int().positive(),
});

const relationTodoSchema = z.object({
  id: z.coerce.number().int().positive(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.coerce.number().int().positive(),
});

const relationCartProductSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number().int().nonnegative(),
  total: z.coerce.number(),
  discountPercentage: z.coerce.number(),
  discountedTotal: z.coerce.number().optional(),
  thumbnail: z.string(),
});

const relationCartSchema = z.object({
  id: z.coerce.number().int().positive(),
  products: z.array(relationCartProductSchema),
  total: z.coerce.number(),
  discountedTotal: z.coerce.number(),
  userId: z.coerce.number().int().positive(),
  totalProducts: z.coerce.number().int().nonnegative(),
  totalQuantity: z.coerce.number().int().nonnegative(),
});

export const userPostsResponseSchema = z.object({
  posts: z.array(relationPostSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const userTodosResponseSchema = z.object({
  todos: z.array(relationTodoSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const userCartsResponseSchema = z.object({
  carts: z.array(relationCartSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export type User = z.infer<typeof userSchema>;
export type UserOption = z.infer<typeof userOptionSchema>;
export type UsersListResponse = z.infer<typeof usersListResponseSchema>;
export type UsersDirectoryResponse = z.infer<typeof usersDirectoryResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type UserPostsResponse = z.infer<typeof userPostsResponseSchema>;
export type UserTodosResponse = z.infer<typeof userTodosResponseSchema>;
export type UserCartsResponse = z.infer<typeof userCartsResponseSchema>;
