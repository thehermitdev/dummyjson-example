import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import {
  getUser,
  getUserCarts,
  getUserPosts,
  getUserTodos,
  getUsers,
  getUsersDirectory,
} from "./client";
import type { UsersListInput } from "./client";

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (input: UsersListInput) => [...usersKeys.lists(), input] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (userId: number) => [...usersKeys.details(), userId] as const,
  directory: () => [...usersKeys.all, "directory"] as const,
  posts: (userId: number) => [...usersKeys.detail(userId), "posts"] as const,
  carts: (userId: number) => [...usersKeys.detail(userId), "carts"] as const,
  todos: (userId: number) => [...usersKeys.detail(userId), "todos"] as const,
};

export function usersListQueryOptions(input: UsersListInput) {
  return queryOptions({
    queryKey: usersKeys.list(input),
    queryFn: ({ signal }) => getUsers(input, signal),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function userDetailQueryOptions(userId: number) {
  return queryOptions({
    queryKey: usersKeys.detail(userId),
    queryFn: ({ signal }) => getUser(userId, signal),
    staleTime: 5 * 60_000,
  });
}

export function usersDirectoryQueryOptions() {
  return queryOptions({
    queryKey: usersKeys.directory(),
    queryFn: ({ signal }) => getUsersDirectory(signal),
    staleTime: 10 * 60_000,
  });
}

export function userPostsQueryOptions(userId: number) {
  return queryOptions({
    queryKey: usersKeys.posts(userId),
    queryFn: ({ signal }) => getUserPosts(userId, signal),
    staleTime: 2 * 60_000,
  });
}

export function userCartsQueryOptions(userId: number) {
  return queryOptions({
    queryKey: usersKeys.carts(userId),
    queryFn: ({ signal }) => getUserCarts(userId, signal),
    staleTime: 2 * 60_000,
  });
}

export function userTodosQueryOptions(userId: number) {
  return queryOptions({
    queryKey: usersKeys.todos(userId),
    queryFn: ({ signal }) => getUserTodos(userId, signal),
    staleTime: 2 * 60_000,
  });
}

export type { UsersListInput } from "./client";
