import type { PostTag } from "../api/contracts";

export function PostTagsPage({ tags, tagList }: { tags: Array<PostTag>; tagList: Array<string> }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Content</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Post Tags</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse metadata from /posts/tags and the raw tag list from /posts/tag-list.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tags.map((tag) => (
          <a
            key={tag.slug}
            href={`/posts?tag=${encodeURIComponent(tag.slug)}`}
            className="rounded-xl border bg-card p-5 shadow-xs transition hover:bg-muted/30"
          >
            <p className="font-semibold">{tag.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{tag.slug}</p>
          </a>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Tag list</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tagList.map((tag) => (
            <a
              key={tag}
              href={`/posts?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
