import type React from "react";

import type {
  UserCartsResponse,
  UserPostsResponse,
  UserTodosResponse,
} from "../api/contracts";

export function UserPostsPanel({ data }: { data: UserPostsResponse }) {
  return (
    <RelationCard title="Posts" count={data.total}>
      {data.posts.map((post) => (
        <a
          key={post.id}
          href={`/posts/${post.id}`}
          className="block rounded-lg border p-4 transition hover:bg-muted/40"
        >
          <p className="font-medium">{post.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
        </a>
      ))}
    </RelationCard>
  );
}

export function UserCartsPanel({ data }: { data: UserCartsResponse }) {
  return (
    <RelationCard title="Carts" count={data.total}>
      {data.carts.map((cart) => (
        <a
          key={cart.id}
          href={`/carts/${cart.id}`}
          className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/40"
        >
          <div>
            <p className="font-medium">Cart #{cart.id}</p>
            <p className="text-sm text-muted-foreground">
              {cart.totalProducts} products · {cart.totalQuantity} items
            </p>
          </div>
          <p className="font-medium">${cart.discountedTotal.toLocaleString()}</p>
        </a>
      ))}
    </RelationCard>
  );
}

export function UserTodosPanel({ data }: { data: UserTodosResponse }) {
  return (
    <RelationCard title="Tasks" count={data.total}>
      {data.todos.map((todo) => (
        <a
          key={todo.id}
          href={`/todos/${todo.id}`}
          className="flex items-center justify-between gap-4 rounded-lg border p-4 transition hover:bg-muted/40"
        >
          <p className="font-medium">{todo.todo}</p>
          <span className="rounded-full bg-muted px-2 py-1 text-xs">
            {todo.completed ? "Completed" : "Open"}
          </span>
        </a>
      ))}
    </RelationCard>
  );
}

function RelationCard({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">{count} records</span>
      </div>
      <div className="grid gap-3 p-5">{children}</div>
    </section>
  );
}
