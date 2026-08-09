import type { ZodType } from "zod";

import {
  createPostInputSchema,
  deletedPostSchema,
  postCommentsResponseSchema,
  postSchema,
  postTagListSchema,
  postTagsSchema,
  postsListResponseSchema,
  updatePostInputSchema,
} from "./contracts";
import type {
  CreatePostInput,
  Post,
  PostComment,
  PostTag,
  PostsListResponse,
  UpdatePostInput,
} from "./contracts";
import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

export interface PostsListInput {
  page: number;
  pageSize: number;
  q?: string | undefined;
  tag?: string | undefined;
  userId?: number | undefined;
  sortBy?: "title" | "views" | "userId" | undefined;
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

export async function getPosts(
  input: PostsListInput,
  signal: AbortSignal,
): Promise<PostsListResponse> {
  const skip = (input.page - 1) * input.pageSize;
  const params = {
    limit: input.pageSize,
    skip,
    ...(input.select ? { select: input.select } : {}),
  };

  if (input.q) {
    const response = await httpClient.get("/posts/search", {
      params: { ...params, q: input.q },
      signal,
    });
    return parseResponse(postsListResponseSchema, response.data, "Invalid posts search response");
  }

  if (input.tag) {
    const response = await httpClient.get(`/posts/tag/${encodeURIComponent(input.tag)}`, {
      params,
      signal,
    });
    return parseResponse(postsListResponseSchema, response.data, "Invalid posts tag response");
  }

  if (input.userId) {
    const response = await httpClient.get(`/posts/user/${input.userId}`, { params, signal });
    return parseResponse(postsListResponseSchema, response.data, "Invalid posts by user response");
  }

  const response = await httpClient.get("/posts", {
    params: {
      ...params,
      ...(input.sortBy ? { sortBy: input.sortBy, order: input.order ?? "asc" } : {}),
    },
    signal,
  });
  return parseResponse(postsListResponseSchema, response.data, "Invalid posts response");
}

export async function getPost(postId: number, signal: AbortSignal): Promise<Post> {
  const response = await httpClient.get(`/posts/${postId}`, { signal });
  return parseResponse(postSchema, response.data, "Invalid post response");
}

export async function getPostTags(signal: AbortSignal): Promise<PostTag[]> {
  const response = await httpClient.get("/posts/tags", { signal });
  return parseResponse(postTagsSchema, response.data, "Invalid post tags response");
}

export async function getPostTagList(signal: AbortSignal): Promise<string[]> {
  const response = await httpClient.get("/posts/tag-list", { signal });
  return parseResponse(postTagListSchema, response.data, "Invalid post tag list response");
}

export async function getPostComments(postId: number, signal: AbortSignal): Promise<PostComment[]> {
  const response = await httpClient.get(`/posts/${postId}/comments`, { signal });
  return parseResponse(postCommentsResponseSchema, response.data, "Invalid post comments response")
    .comments;
}

export async function addPost(input: CreatePostInput): Promise<Post> {
  const parsed = createPostInputSchema.parse(input);
  const response = await httpClient.post("/posts/add", parsed);
  return parseResponse(
    postSchema,
    {
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
      ...parsed,
      ...(typeof response.data === "object" && response.data ? response.data : {}),
    },
    "Invalid add post response",
  );
}

export async function updatePost(post: Post, input: UpdatePostInput): Promise<Post> {
  const parsed = updatePostInputSchema.parse(input);
  const response = await httpClient.patch(`/posts/${post.id}`, parsed);
  return parseResponse(
    postSchema,
    {
      ...post,
      ...parsed,
      ...(typeof response.data === "object" && response.data ? response.data : {}),
    },
    "Invalid update post response",
  );
}

export async function deletePost(postId: number): Promise<Post> {
  const response = await httpClient.delete(`/posts/${postId}`);
  const deleted = parseResponse(deletedPostSchema, response.data, "Invalid delete post response");
  return postSchema.parse(deleted);
}
