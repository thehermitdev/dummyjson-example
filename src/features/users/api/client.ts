import type { ZodType } from "zod";

import {
  createUserInputSchema,
  deletedUserSchema,
  updateUserInputSchema,
  userCartsResponseSchema,
  userPostsResponseSchema,
  userSchema,
  userTodosResponseSchema,
  usersDirectoryResponseSchema,
  usersListResponseSchema,
} from "./contracts";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserCartsResponse,
  UserPostsResponse,
  UserTodosResponse,
  UsersDirectoryResponse,
  UsersListResponse,
} from "./contracts";
import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

export interface UsersListInput {
  page: number;
  pageSize: number;
  q?: string | undefined;
  filterKey?: "hair.color" | "role" | "gender" | undefined;
  filterValue?: string | undefined;
  sortBy?: "firstName" | "lastName" | "age" | "email" | undefined;
  order?: "asc" | "desc" | undefined;
  select?: string | undefined;
}

function parseResponse<T>(schema: ZodType<T>, data: unknown, message: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApplicationError(message, {
      code: "API_CONTRACT_ERROR",
      details: result.error.flatten(),
      cause: result.error,
    });
  }
  return result.data;
}

export async function getUsers(
  input: UsersListInput,
  signal: AbortSignal,
): Promise<UsersListResponse> {
  const skip = (input.page - 1) * input.pageSize;
  const common = {
    limit: input.pageSize,
    skip,
    ...(input.select ? { select: input.select } : {}),
  };

  if (input.q) {
    const response = await httpClient.get("/users/search", {
      params: { ...common, q: input.q },
      signal,
    });
    return parseResponse(usersListResponseSchema, response.data, "Invalid users search response");
  }

  if (input.filterKey && input.filterValue) {
    const response = await httpClient.get("/users/filter", {
      params: { ...common, key: input.filterKey, value: input.filterValue },
      signal,
    });
    return parseResponse(usersListResponseSchema, response.data, "Invalid users filter response");
  }

  const response = await httpClient.get("/users", {
    params: {
      ...common,
      ...(input.sortBy ? { sortBy: input.sortBy, order: input.order ?? "asc" } : {}),
    },
    signal,
  });
  return parseResponse(usersListResponseSchema, response.data, "Invalid users response");
}

export async function getUser(userId: number, signal: AbortSignal): Promise<User> {
  const response = await httpClient.get(`/users/${userId}`, { signal });
  return parseResponse(userSchema, response.data, "Invalid user response");
}

export async function getUsersDirectory(signal: AbortSignal): Promise<UsersDirectoryResponse> {
  const response = await httpClient.get("/users", {
    params: { limit: 0, select: "id,firstName,lastName,email,image" },
    signal,
  });
  return parseResponse(
    usersDirectoryResponseSchema,
    response.data,
    "Invalid users directory response",
  );
}

export async function getUserPosts(
  userId: number,
  signal: AbortSignal,
): Promise<UserPostsResponse> {
  const response = await httpClient.get(`/users/${userId}/posts`, { signal });
  return parseResponse(userPostsResponseSchema, response.data, "Invalid user posts response");
}

export async function getUserCarts(
  userId: number,
  signal: AbortSignal,
): Promise<UserCartsResponse> {
  const response = await httpClient.get(`/users/${userId}/carts`, { signal });
  return parseResponse(userCartsResponseSchema, response.data, "Invalid user carts response");
}

export async function getUserTodos(
  userId: number,
  signal: AbortSignal,
): Promise<UserTodosResponse> {
  const response = await httpClient.get(`/users/${userId}/todos`, { signal });
  return parseResponse(userTodosResponseSchema, response.data, "Invalid user todos response");
}

export async function addUser(input: CreateUserInput): Promise<User> {
  const parsed = createUserInputSchema.parse(input);
  const username = `${parsed.firstName}.${parsed.lastName}`.toLowerCase().replace(/\s+/g, "");
  const payload = {
    ...parsed,
    username,
    maidenName: "",
    image: `https://dummyjson.com/icon/${encodeURIComponent(username)}/128`,
    hair: { color: "Brown", type: "Straight" },
    company: {
      department: parsed.department,
      name: "DummyJSON Admin",
      title: parsed.title,
    },
  };
  const response = await httpClient.post("/users/add", payload);
  return parseResponse(userSchema, response.data, "Invalid add user response");
}

export async function updateUser(userId: number, input: UpdateUserInput): Promise<User> {
  const parsed = updateUserInputSchema.parse(input);
  const payload = {
    ...parsed,
    ...(parsed.department || parsed.title
      ? {
          company: {
            department: parsed.department ?? "Operations",
            name: "DummyJSON Admin",
            title: parsed.title ?? "Team Member",
          },
        }
      : {}),
  };
  const response = await httpClient.patch(`/users/${userId}`, payload);
  return parseResponse(userSchema, response.data, "Invalid update user response");
}

export async function deleteUser(userId: number): Promise<User> {
  const response = await httpClient.delete(`/users/${userId}`);
  const deleted = parseResponse(deletedUserSchema, response.data, "Invalid delete user response");
  return userSchema.parse(deleted);
}
