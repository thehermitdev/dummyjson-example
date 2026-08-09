import { mutationOptions } from "@tanstack/react-query";
import { addPost, deletePost, updatePost } from "./client";
import { postsKeys } from "./queries";
import type { QueryClient } from "@tanstack/react-query";

import type { CreatePostInput, Post, PostsListResponse, UpdatePostInput } from "./contracts";

function replacePost(queryClient: QueryClient, post: Post) {
  queryClient.setQueriesData<PostsListResponse>({ queryKey: postsKeys.lists() }, (current) =>
    current
      ? { ...current, posts: current.posts.map((item) => (item.id === post.id ? post : item)) }
      : current,
  );
  queryClient.setQueryData(postsKeys.detail(post.id), post);
}

export function addPostMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...postsKeys.all, "add"],
    mutationFn: (input: CreatePostInput) => addPost(input),
    onSuccess: (post) => {
      queryClient.setQueriesData<PostsListResponse>({ queryKey: postsKeys.lists() }, (current) =>
        current
          ? {
              ...current,
              posts: [post, ...current.posts].slice(0, current.limit || current.posts.length + 1),
              total: current.total + 1,
            }
          : current,
      );
      queryClient.setQueryData(postsKeys.detail(post.id), post);
    },
  });
}

export function updatePostMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...postsKeys.all, "update"],
    mutationFn: ({ post, input }: { post: Post; input: UpdatePostInput }) =>
      updatePost(post, input),
    onSuccess: (post) => replacePost(queryClient, post),
  });
}

export function deletePostMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationKey: [...postsKeys.all, "delete"],
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: (post) => {
      queryClient.setQueriesData<PostsListResponse>({ queryKey: postsKeys.lists() }, (current) =>
        current
          ? {
              ...current,
              posts: current.posts.filter((item) => item.id !== post.id),
              total: Math.max(0, current.total - 1),
            }
          : current,
      );
      queryClient.removeQueries({ queryKey: postsKeys.detail(post.id) });
    },
  });
}
