import {
  createTodoInputSchema,
  deletedTodoSchema,
  todoSchema,
  todosListResponseSchema,
  updateTodoInputSchema,
} from "./contracts";
import type {
  CreateTodoInput,
  Todo,
  TodosListResponse,
  UpdateTodoInput,
} from "./contracts";
import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

export interface TodosListInput {
  page: number;
  pageSize: number;
  userId?: number | undefined;
}

export async function getTodos(input: TodosListInput, signal: AbortSignal): Promise<TodosListResponse> {
  const params = { limit: input.pageSize, skip: (input.page - 1) * input.pageSize };
  const endpoint = input.userId ? `/todos/user/${input.userId}` : "/todos";
  const response = await httpClient.get(endpoint, { params, signal });
  const result = todosListResponseSchema.safeParse(response.data);
  if (!result.success) {
    throw new ApplicationError("Invalid todos response", {
      code: "API_CONTRACT_ERROR",
      details: result.error.flatten(),
      cause: result.error,
    });
  }
  return result.data;
}

export async function getTodo(todoId: number, signal: AbortSignal): Promise<Todo> {
  const response = await httpClient.get(`/todos/${todoId}`, { signal });
  const result = todoSchema.safeParse(response.data);
  if (!result.success) {
    throw new ApplicationError("Invalid todo response", {
      code: "API_CONTRACT_ERROR",
      details: result.error.flatten(),
      cause: result.error,
    });
  }
  return result.data;
}

export async function addTodo(input: CreateTodoInput): Promise<Todo> {
  const parsed = createTodoInputSchema.parse(input);
  const response = await httpClient.post("/todos/add", parsed);
  return todoSchema.parse({
    ...parsed,
    ...(typeof response.data === "object" && response.data ? response.data : {}),
  });
}

export async function updateTodo(todo: Todo, input: UpdateTodoInput): Promise<Todo> {
  const parsed = updateTodoInputSchema.parse(input);
  const response = await httpClient.patch(`/todos/${todo.id}`, parsed);
  return todoSchema.parse({
    ...todo,
    ...parsed,
    ...(typeof response.data === "object" && response.data ? response.data : {}),
  });
}

export async function deleteTodo(todoId: number): Promise<Todo> {
  const response = await httpClient.delete(`/todos/${todoId}`);
  return todoSchema.parse(deletedTodoSchema.parse(response.data));
}
