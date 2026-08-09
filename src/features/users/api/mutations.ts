import { mutationOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { addUser, deleteUser, updateUser } from "./client";
import type { CreateUserInput, UpdateUserInput, User, UsersListResponse } from "./contracts";
import { usersKeys } from "./queries";

function replaceInLists(queryClient: QueryClient, user: User) {
  queryClient.setQueriesData<UsersListResponse>({ queryKey: usersKeys.lists() }, (current) =>
    current
      ? {
          ...current,
          users: current.users.map((item) => (item.id === user.id ? user : item)),
        }
      : current,
  );
  queryClient.setQueryData(usersKeys.detail(user.id), user);
}

export function addUserMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...usersKeys.all, "add"],
    mutationFn: (input: CreateUserInput) => addUser(input),
    onSuccess: (user) => {
      queryClient.setQueriesData<UsersListResponse>({ queryKey: usersKeys.lists() }, (current) =>
        current
          ? {
              ...current,
              users: [user, ...current.users].slice(0, current.limit || current.users.length + 1),
              total: current.total + 1,
            }
          : current,
      );
      queryClient.setQueryData(usersKeys.detail(user.id), user);
    },
  });
}

export function updateUserMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...usersKeys.all, "update"],
    mutationFn: ({ userId, input }: { userId: number; input: UpdateUserInput }) =>
      updateUser(userId, input),
    onSuccess: (user) => replaceInLists(queryClient, user),
  });
}

export function deleteUserMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...usersKeys.all, "delete"],
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: (user) => {
      queryClient.setQueriesData<UsersListResponse>({ queryKey: usersKeys.lists() }, (current) =>
        current
          ? {
              ...current,
              users: current.users.filter((item) => item.id !== user.id),
              total: Math.max(0, current.total - 1),
            }
          : current,
      );
      queryClient.removeQueries({ queryKey: usersKeys.detail(user.id) });
    },
  });
}
