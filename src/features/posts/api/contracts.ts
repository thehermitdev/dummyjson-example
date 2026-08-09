import { z } from "zod";

export const postSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1),
  body: z.string(),
  tags: z.array(z.string()),
  reactions: z.object({
    likes: z.coerce.number().int().nonnegative(),
    dislikes: z.coerce.number().int().nonnegative(),
  }),
  views: z.coerce.number().int().nonnegative(),
  userId: z.coerce.number().int().positive(),
});

export const postsListResponseSchema = z.object({
  posts: z.array(postSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const postTagSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  url: z.url(),
});

export const postTagsSchema = z.array(postTagSchema);
export const postTagListSchema = z.array(z.string());

export const postCommentSchema = z.object({
  id: z.coerce.number().int().positive(),
  body: z.string(),
  postId: z.coerce.number().int().positive(),
  likes: z.coerce.number().int().nonnegative(),
  user: z.object({
    id: z.coerce.number().int().positive(),
    username: z.string(),
    fullName: z.string(),
  }),
});

export const postCommentsResponseSchema = z.object({
  comments: z.array(postCommentSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const createPostInputSchema = z.object({
  title: z.string().trim().min(3),
  body: z.string().trim().min(3),
  tags: z.array(z.string().trim().min(1)).min(1),
  userId: z.coerce.number().int().positive(),
});

export const updatePostInputSchema = createPostInputSchema.partial();

export const deletedPostSchema = postSchema.extend({
  isDeleted: z.boolean(),
  deletedOn: z.string(),
});

export type Post = z.infer<typeof postSchema>;
export type PostsListResponse = z.infer<typeof postsListResponseSchema>;
export type PostTag = z.infer<typeof postTagSchema>;
export type PostComment = z.infer<typeof postCommentSchema>;
export type PostCommentsResponse = z.infer<typeof postCommentsResponseSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
