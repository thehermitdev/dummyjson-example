import type { Post, PostComment } from "../api/contracts";

export function PostDetailPage({
  post,
  comments,
  author,
}: {
  post: Post;
  comments: PostComment[];
  author: string;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <article className="rounded-xl border bg-card p-6 shadow-xs">
        <p className="text-sm font-medium text-primary">Post #{post.id}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          By {author} · {post.views.toLocaleString()} views · {post.reactions.likes} likes ·{" "}
          {post.reactions.dislikes} dislikes
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <a
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-muted px-2.5 py-1 text-xs hover:bg-muted/70"
            >
              {tag}
            </a>
          ))}
        </div>
        <p className="mt-8 whitespace-pre-wrap leading-7 text-foreground/90">{post.body}</p>
      </article>
      <aside className="rounded-xl border bg-card shadow-xs">
        <div className="border-b p-5">
          <h2 className="font-semibold">Comments</h2>
          <p className="text-sm text-muted-foreground">{comments.length} comments</p>
        </div>
        <div className="divide-y">
          {comments.map((comment) => (
            <div key={comment.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{comment.user.fullName}</p>
                <span className="text-xs text-muted-foreground">{comment.likes} likes</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{comment.body}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
