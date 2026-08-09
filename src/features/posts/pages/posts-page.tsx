import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  createPostInputSchema,
  type CreatePostInput,
  type Post,
  type PostsListResponse,
} from "../api/contracts";
import {
  addPostMutationOptions,
  deletePostMutationOptions,
  updatePostMutationOptions,
} from "../api/mutations";
import type { PostsListInput } from "../api/queries";
import { ConfirmDeleteDialog } from "#/shared/components/confirm-delete-dialog";
import { DataPagination } from "#/shared/components/data-pagination";
import { Alert, AlertDescription, AlertTitle } from "#/shared/components/ui/alert";
import { Button } from "#/shared/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "#/shared/components/ui/drawer";

interface UserOption {
  id: number;
  firstName: string;
  lastName: string;
}

interface PostsPageProps {
  data: PostsListResponse;
  input: PostsListInput;
  tags: string[];
  users: UserOption[];
  onInputChange: (next: Partial<PostsListInput>) => void;
}

const emptyForm: CreatePostInput = {
  title: "",
  body: "",
  tags: ["life"],
  userId: 1,
};

export function PostsPage({ data, input, tags, users, onInputChange }: PostsPageProps) {
  const queryClient = useQueryClient();
  const addMutation = useMutation(addPostMutationOptions(queryClient));
  const updateMutation = useMutation(updatePostMutationOptions(queryClient));
  const deleteMutation = useMutation(deletePostMutationOptions(queryClient));
  const [search, setSearch] = React.useState(input.q ?? "");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Post | null>(null);
  const [form, setForm] = React.useState<CreatePostInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<Post | null>(null);

  const userMap = React.useMemo(() => new Map(users.map((user) => [user.id, `${user.firstName} ${user.lastName}`])), [users]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, userId: users[0]?.id ?? 1 });
    setFormError(null);
    setDrawerOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({ title: post.title, body: post.body, tags: post.tags, userId: post.userId });
    setFormError(null);
    setDrawerOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = createPostInputSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please review the post fields.");
      return;
    }
    try {
      if (editing) {
        await updateMutation.mutateAsync({ post: editing, input: parsed.data });
        toast.success("Post updated");
      } else {
        await addMutation.mutateAsync(parsed.data);
        toast.success("Post created", { description: "The simulated post was inserted into the current cache." });
      }
      setDrawerOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save post.");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success("Post deleted");
      setDeleting(null);
    } catch (error) {
      toast.error("Delete failed", { description: error instanceof Error ? error.message : "Unable to delete post." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-medium text-primary">Content</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Posts</h1><p className="mt-2 text-sm text-muted-foreground">Manage user-generated content, tags, authors, reactions, and comments.</p></div>
        <Button onClick={openAdd}><Plus className="size-4" /> Add Post</Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="grid gap-3 border-b p-4 lg:grid-cols-[minmax(220px,1fr)_180px_160px_140px_auto]">
          <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); onInputChange({ q: search.trim() || undefined, tag: undefined, page: 1 }); }}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search posts…" className="h-9 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm" />
            <Button type="submit" variant="outline" size="icon"><Search className="size-4" /></Button>
          </form>
          <select value={input.tag ?? ""} onChange={(event) => onInputChange({ tag: event.target.value || undefined, q: undefined, page: 1 })} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="">All tags</option>{tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select>
          <select value={input.sortBy ?? ""} onChange={(event) => onInputChange({ sortBy: event.target.value || undefined, page: 1 })} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="">Sort by</option><option value="title">Title</option><option value="views">Views</option><option value="userId">User ID</option></select>
          <select value={input.order ?? "asc"} onChange={(event) => onInputChange({ order: event.target.value as "asc" | "desc", page: 1 })} className="h-9 rounded-md border bg-background px-3 text-sm"><option value="asc">Ascending</option><option value="desc">Descending</option></select>
          <a href="/posts/tags" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium hover:bg-muted">Browse tags</a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm"><thead className="border-b bg-muted/40 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Post</th><th className="px-4 py-3 font-medium">Author</th><th className="px-4 py-3 font-medium">Tags</th><th className="px-4 py-3 font-medium">Engagement</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y">
            {data.posts.map((post) => <tr key={post.id} className="hover:bg-muted/30"><td className="max-w-xl px-4 py-3"><a href={`/posts/${post.id}`} className="font-medium hover:underline">{post.title}</a><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{post.body}</p></td><td className="px-4 py-3 text-muted-foreground">{userMap.get(post.userId) ?? `User #${post.userId}`}</td><td className="px-4 py-3"><div className="flex max-w-52 flex-wrap gap-1">{post.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>)}</div></td><td className="px-4 py-3 text-xs text-muted-foreground">{post.views.toLocaleString()} views · {post.reactions.likes} likes</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon-sm" render={<a href={`/posts/${post.id}`} />}><Eye className="size-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => openEdit(post)}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon-sm" onClick={() => setDeleting(post)}><Trash2 className="size-4" /></Button></div></td></tr>)}
          </tbody></table>
        </div>
        <DataPagination page={input.page} pageSize={input.pageSize} total={data.total} onPageChange={(page) => onInputChange({ page })} onPageSizeChange={(pageSize) => onInputChange({ pageSize, page: 1 })} />
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent><form className="flex h-full flex-col" onSubmit={submit}><DrawerHeader><DrawerTitle>{editing ? "Update post" : "Add post"}</DrawerTitle><DrawerDescription>Posts are always attributed to a DummyJSON user.</DrawerDescription></DrawerHeader><DrawerBody><div className="grid gap-4"><Field label="Title"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="field-input" /></Field><Field label="Body"><textarea required rows={8} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="field-input min-h-32" /></Field><Field label="Tags (comma separated)"><input value={form.tags.join(", ")} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} className="field-input" /></Field><Field label="Author"><select value={form.userId} onChange={(event) => setForm({ ...form, userId: Number(event.target.value) })} className="field-input">{users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)}</select></Field></div>{formError ? <Alert variant="destructive" className="mt-5"><AlertTitle>Unable to save post</AlertTitle><AlertDescription>{formError}</AlertDescription></Alert> : null}</DrawerBody><DrawerFooter><Button type="button" variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button><Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>{addMutation.isPending || updateMutation.isPending ? "Saving…" : "Save post"}</Button></DrawerFooter></form></DrawerContent>
      </Drawer>

      <ConfirmDeleteDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title="Delete post?" description={deleting ? `This will simulate deleting “${deleting.title}”.` : "Delete the selected post."} pending={deleteMutation.isPending} onConfirm={() => void confirmDelete()} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium"><span>{label}</span>{children}</label>;
}
