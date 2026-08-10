import { mutationOptions } from "@tanstack/react-query";
import { addUser, deleteUser, updateUser } from "./client";
import { usersKeys } from "./queries";
import type { QueryClient } from "@tanstack/react-query";
import type { CreateUserInput, UpdateUserInput, User, UsersListResponse } from "./contracts";

function updateUsersListCache(
  queryClient: QueryClient,
  action: "add" | "update" | "delete",
  user: User
) {
  queryClient.setQueriesData<UsersListResponse>({ queryKey: usersKeys.lists() }, (current) => {
    if (!current) return current;

    switch (action) {
      case "add":
        return {
          ...current,
          users: [user, ...current.users].slice(0, current.limit || current.users.length + 1),
          total: current.total + 1,
        };
      case "update":
        return {
          ...current,
          users: current.users.map((item) => (item.id === user.id ? user : item)),
        };
      case "delete":
        return {
          ...current,
          users: current.users.filter((item) => item.id !== user.id),
          total: Math.max(0, current.total - 1),
        };
      default:
        return current;
    }
  });
}

function updateUserDetailCache(
  queryClient: QueryClient,
  action: "add" | "update" | "delete",
  user: User
) {
  const detailKey = usersKeys.detail(user.id);
  if (action === "delete") {
    queryClient.removeQueries({ queryKey: detailKey });
  } else {
    queryClient.setQueryData(detailKey, user);
  }
}

function handleMutationSuccess(
  queryClient: QueryClient,
  action: "add" | "update" | "delete",
  user: User
) {
  updateUsersListCache(queryClient, action, user);
  updateUserDetailCache(queryClient, action, user);
  // queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
}

export function addUserMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...usersKeys.all, "add"],
    mutationFn: (input: CreateUserInput) => addUser(input),
    onSuccess: (user) => handleMutationSuccess(queryClient, "add", user),
  });
}

export function updateUserMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...usersKeys.all, "update"],
    mutationFn: ({ userId, input }: { userId: number; input: UpdateUserInput }) =>
      updateUser(userId, input),
    onSuccess: (user) => handleMutationSuccess(queryClient, "update", user),
  });
}

export function deleteUserMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...usersKeys.all, "delete"],
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: (user) => handleMutationSuccess(queryClient, "delete", user),
  });
}
