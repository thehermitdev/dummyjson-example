import { z } from "zod";

export const todoSchema = z.object({
  id: z.coerce.number().int().positive(),
  todo: z.string().min(1),
  completed: z.boolean(),
  userId: z.coerce.number().int().positive(),
});

export const todosListResponseSchema = z.object({
  todos: z.array(todoSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const createTodoInputSchema = z.object({
  todo: z.string().trim().min(3),
  completed: z.boolean(),
  userId: z.coerce.number().int().positive(),
});
export const updateTodoInputSchema = createTodoInputSchema.partial();
export const deletedTodoSchema = todoSchema.extend({ isDeleted: z.boolean(), deletedOn: z.string() });

export type Todo = z.infer<typeof todoSchema>;
export type TodosListResponse = z.infer<typeof todosListResponseSchema>;
export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoInputSchema>;
