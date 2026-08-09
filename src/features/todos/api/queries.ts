import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getTodo, getTodos } from "./client";
import type { TodosListInput } from "./client";

export const todosKeys = {
  all: ["todos"] as const,
  lists: () => [...todosKeys.all, "list"] as const,
  list: (input: TodosListInput) => [...todosKeys.lists(), input] as const,
  details: () => [...todosKeys.all, "detail"] as const,
  detail: (todoId: number) => [...todosKeys.details(), todoId] as const,
};

export function todosListQueryOptions(input: TodosListInput) {
  return queryOptions({
    queryKey: todosKeys.list(input),
    queryFn: ({ signal }) => getTodos(input, signal),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function todoDetailQueryOptions(todoId: number) {
  return queryOptions({
    queryKey: todosKeys.detail(todoId),
    queryFn: ({ signal }) => getTodo(todoId, signal),
    staleTime: 2 * 60_000,
  });
}

export type { TodosListInput } from "./client";
