# DummyJSON Admin Example

A production-oriented client-rendered React SPA demonstrating a user-centered admin backoffice with Bun, TanStack Router, TanStack Query, Clerk, Axios, Zod, Tailwind CSS v4, and shadcn/ui-style Base UI primitives.

## Modules

- Dashboard overview
- Users: list, detail, search, nested filter, pagination, sort, related carts/posts/tasks, simulated add/update/delete
- Posts: list, detail, search, pagination, sort, tags, tag list, posts by tag/user, comments, simulated add/update/delete
- Carts: list, detail, filter by user
- Tasks (DummyJSON Todos): list, detail, pagination, filter by assignee, simulated add/update/delete and reassignment

## Admin shell

The protected area adapts the composition of shadcn/ui `sidebar-08`:

- `SidebarHeader`: DummyJSON Admin brand
- `SidebarContent`: nested module navigation
- `SidebarFooter`: Clerk profile
- `SidebarInset`: trigger, breadcrumb, routed module content
- list screens: URL-driven shadcn-style pagination

## Routes

```text
/
└── protected admin
    ├── /dashboard
    ├── /users
    │   └── /users/:userId
    │       ├── /users/:userId/posts
    │       ├── /users/:userId/carts
    │       └── /users/:userId/todos
    ├── /posts
    │   ├── /posts/tags
    │   └── /posts/:postId
    ├── /carts
    │   └── /carts/:cartId
    └── /todos
        └── /todos/:todoId
```

## State ownership

- URL state: TanStack Router search params
- Server state: TanStack Query
- API contracts: Zod
- HTTP transport: shared Axios client
- Authentication: Clerk at the application composition boundary
- form/drawer/dialog state: local React state

DummyJSON write endpoints are simulations and do not persist on the server. The mutation layer updates Query Cache on successful add/update/delete so the admin experience behaves like a real application during the current session.

## Environment

```dotenv
VITE_APP_NAME=DummyJSON Admin
VITE_API_BASE_URL=https://dummyjson.com
VITE_API_TIMEOUT_MS=15000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## Install and validate

```bash
bun install
bun run check
```

Then run:

```bash
bun run dev
```
