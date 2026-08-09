import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getPost, getPostComments, getPostTagList, getPostTags, getPosts } from "./client";
import type { PostsListInput } from "./client";

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: (input: PostsListInput) => [...postsKeys.lists(), input] as const,
  details: () => [...postsKeys.all, "detail"] as const,
  detail: (postId: number) => [...postsKeys.details(), postId] as const,
  tags: () => [...postsKeys.all, "tags"] as const,
  tagList: () => [...postsKeys.all, "tag-list"] as const,
  comments: (postId: number) => [...postsKeys.detail(postId), "comments"] as const,
};

export function postsListQueryOptions(input: PostsListInput) {
  return queryOptions({
    queryKey: postsKeys.list(input),
    queryFn: ({ signal }) => getPosts(input, signal),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function postDetailQueryOptions(postId: number) {
  return queryOptions({
    queryKey: postsKeys.detail(postId),
    queryFn: ({ signal }) => getPost(postId, signal),
    staleTime: 5 * 60_000,
  });
}

export function postTagsQueryOptions() {
  return queryOptions({
    queryKey: postsKeys.tags(),
    queryFn: ({ signal }) => getPostTags(signal),
    staleTime: 10 * 60_000,
  });
}

export function postTagListQueryOptions() {
  return queryOptions({
    queryKey: postsKeys.tagList(),
    queryFn: ({ signal }) => getPostTagList(signal),
    staleTime: 10 * 60_000,
  });
}

export function postCommentsQueryOptions(postId: number) {
  return queryOptions({
    queryKey: postsKeys.comments(postId),
    queryFn: ({ signal }) => getPostComments(postId, signal),
    staleTime: 2 * 60_000,
  });
}

export type { PostsListInput } from "./client";
