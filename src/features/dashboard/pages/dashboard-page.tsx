import { CheckSquare2, FileText, ShoppingCart, UsersRound } from "lucide-react";

interface DashboardPageProps {
  totals: { users: number; posts: number; carts: number; todos: number };
  recentUsers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  }>;
}

export function DashboardPage({ totals, recentUsers }: DashboardPageProps) {
  const cards = [
    { label: "Users", value: totals.users, href: "/users", icon: UsersRound },
    { label: "Posts", value: totals.posts, href: "/posts", icon: FileText },
    { label: "Carts", value: totals.carts, href: "/carts", icon: ShoppingCart },
    { label: "Tasks", value: totals.todos, href: "/todos", icon: CheckSquare2 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Overview</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A user-centered backoffice view across DummyJSON users, content, commerce, and tasks.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="rounded-xl border bg-card p-5 shadow-xs transition hover:bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-3xl font-semibold">{value.toLocaleString()}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Open {label.toLowerCase()} module →
            </p>
          </a>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <section className="rounded-xl border bg-card shadow-xs">
          <div className="border-b p-5">
            <h2 className="font-semibold">Recent users</h2>
            <p className="text-sm text-muted-foreground">
              A lightweight preview from the Users module.
            </p>
          </div>
          <div className="divide-y">
            {recentUsers.map((user) => (
              <a
                key={user.id}
                href={`/users/${user.id}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/30"
              >
                <img src={user.image} alt="" className="size-10 rounded-full border bg-muted" />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="rounded-xl border bg-card p-5 shadow-xs">
          <h2 className="font-semibold">Admin model</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Users are the central entity. Posts are authored by users, carts belong to users, and
            tasks are assigned to users. Navigate from a user profile to inspect all three
            relationships.
          </p>
          <div className="mt-5 grid gap-2">
            <a href="/users" className="rounded-lg border p-3 text-sm font-medium hover:bg-muted">
              Manage users
            </a>
            <a href="/posts" className="rounded-lg border p-3 text-sm font-medium hover:bg-muted">
              Review content
            </a>
            <a href="/todos" className="rounded-lg border p-3 text-sm font-medium hover:bg-muted">
              Manage tasks
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
