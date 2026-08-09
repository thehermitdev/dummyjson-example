import { mutationOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { addTodo, deleteTodo, updateTodo } from "./client";
import type { CreateTodoInput, Todo, TodosListResponse, UpdateTodoInput } from "./contracts";
import { todosKeys } from "./queries";

function replaceTodo(queryClient: QueryClient, todo: Todo) {
  queryClient.setQueriesData<TodosListResponse>({ queryKey: todosKeys.lists() }, (current) => current ? { ...current, todos: current.todos.map((item) => item.id === todo.id ? todo : item) } : current);
  queryClient.setQueryData(todosKeys.detail(todo.id), todo);
}

export function addTodoMutationOptions(queryClient: QueryClient) { return mutationOptions({ mutationKey: [...todosKeys.all, "add"], mutationFn: (input: CreateTodoInput) => addTodo(input), onSuccess: (todo) => { queryClient.setQueriesData<TodosListResponse>({ queryKey: todosKeys.lists() }, (current) => current ? { ...current, todos: [todo, ...current.todos].slice(0, current.limit || current.todos.length + 1), total: current.total + 1 } : current); queryClient.setQueryData(todosKeys.detail(todo.id), todo); } }); }
export function updateTodoMutationOptions(queryClient: QueryClient) { return mutationOptions({ mutationKey: [...todosKeys.all, "update"], mutationFn: ({ todo, input }: { todo: Todo; input: UpdateTodoInput }) => updateTodo(todo, input), onSuccess: (todo) => replaceTodo(queryClient, todo) }); }
export function deleteTodoMutationOptions(queryClient: QueryClient) { return mutationOptions({ mutationKey: [...todosKeys.all, "delete"], mutationFn: (todoId: number) => deleteTodo(todoId), onSuccess: (todo) => { queryClient.setQueriesData<TodosListResponse>({ queryKey: todosKeys.lists() }, (current) => current ? { ...current, todos: current.todos.filter((item) => item.id !== todo.id), total: Math.max(0, current.total - 1) } : current); queryClient.removeQueries({ queryKey: todosKeys.detail(todo.id) }); } }); }
