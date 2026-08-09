import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createUserInputSchema } from "../api/contracts";
import {
  addUserMutationOptions,
  deleteUserMutationOptions,
  updateUserMutationOptions,
} from "../api/mutations";
import type { CreateUserInput, User, UsersListResponse } from "../api/contracts";
import type { UsersListInput } from "../api/queries";
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

interface UsersPageProps {
  data: UsersListResponse;
  input: UsersListInput;
  onInputChange: (next: Partial<UsersListInput>) => void;
}

const emptyForm: CreateUserInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: 18,
  gender: "female",
  role: "user",
  department: "Operations",
  title: "Team Member",
};

function formFromUser(user: User): CreateUserInput {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    age: user.age,
    gender: user.gender === "male" ? "male" : "female",
    role: user.role,
    department: user.company.department,
    title: user.company.title,
  };
}

export function UsersPage({ data, input, onInputChange }: UsersPageProps) {
  const queryClient = useQueryClient();
  const addMutation = useMutation(addUserMutationOptions(queryClient));
  const updateMutation = useMutation(updateUserMutationOptions(queryClient));
  const deleteMutation = useMutation(deleteUserMutationOptions(queryClient));

  const [search, setSearch] = React.useState(input.q ?? "");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<User | null>(null);
  const [form, setForm] = React.useState<CreateUserInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<User | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setDrawerOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm(formFromUser(user));
    setFormError(null);
    setDrawerOpen(true);
  };

  const submitUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = createUserInputSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please review the form fields.");
      return;
    }

    setFormError(null);
    try {
      if (editing) {
        await updateMutation.mutateAsync({ userId: editing.id, input: parsed.data });
        toast.success("User updated", {
          description: `${parsed.data.firstName} ${parsed.data.lastName} was updated.`,
        });
      } else {
        await addMutation.mutateAsync(parsed.data);
        toast.success("User created", {
          description: `${parsed.data.firstName} ${parsed.data.lastName} was added to the current session.`,
        });
      }
      setDrawerOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "The user mutation failed.");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success("User deleted", {
        description: `${deleting.firstName} ${deleting.lastName} was removed from the current session.`,
      });
      setDeleting(null);
    } catch (error) {
      toast.error("Delete failed", {
        description: error instanceof Error ? error.message : "Unable to delete the user.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">User Management</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search, filter, sort, inspect, and simulate user lifecycle operations through DummyJSON.
          </p>
        </div>
        <Button type="button" onClick={openAdd}>
          <Plus className="size-4" /> Add User
        </Button>
      </div>

      <Alert variant="warning">
        <AlertTitle>Demo mutation behavior</AlertTitle>
        <AlertDescription>
          DummyJSON simulates writes without persisting them. Successful mutations are reconciled
          into TanStack Query cache so this admin UI behaves like a real app until the session is
          refreshed.
        </AlertDescription>
      </Alert>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="grid gap-3 border-b p-4 lg:grid-cols-[minmax(220px,1fr)_180px_180px_140px_auto]">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              onInputChange({
                q: search.trim() || undefined,
                filterKey: undefined,
                filterValue: undefined,
                page: 1,
              });
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users…"
              className="h-9 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            />
            <Button type="submit" variant="outline" size="icon">
              <Search className="size-4" />
            </Button>
          </form>

          <select
            value={input.filterKey ?? ""}
            onChange={(event) =>
              onInputChange({
                filterKey: (event.target.value || undefined) as UsersListInput["filterKey"],
                q: undefined,
                page: 1,
              })
            }
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Filter field</option>
            <option value="hair.color">Hair color</option>
            <option value="role">Role</option>
            <option value="gender">Gender</option>
          </select>

          <input
            value={input.filterValue ?? ""}
            onChange={(event) =>
              onInputChange({ filterValue: event.target.value || undefined, q: undefined, page: 1 })
            }
            placeholder="Filter value"
            className="h-9 rounded-md border bg-background px-3 text-sm"
          />

          <select
            value={input.sortBy ?? ""}
            onChange={(event) =>
              onInputChange({
                sortBy: (event.target.value || undefined) as UsersListInput["sortBy"],
                page: 1,
              })
            }
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Sort by</option>
            <option value="firstName">First name</option>
            <option value="lastName">Last name</option>
            <option value="age">Age</option>
            <option value="email">Email</option>
          </select>

          <select
            value={input.order ?? "asc"}
            onChange={(event) =>
              onInputChange({ order: event.target.value as "asc" | "desc", page: 1 })
            }
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image}
                        alt=""
                        className="size-10 rounded-full border bg-muted object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <a
                          href={`/users/${user.id}`}
                          className="truncate font-medium hover:underline"
                        >
                          {user.firstName} {user.lastName}
                        </a>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-56 truncate font-medium">{user.company.name}</p>
                    <p className="max-w-56 truncate text-xs text-muted-foreground">
                      {user.company.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.age}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={<a href={`/users/${user.id}`} />}
                      >
                        <Eye className="size-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(user)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(user)}>
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataPagination
          page={input.page}
          pageSize={input.pageSize}
          total={data.total}
          onPageChange={(page) => onInputChange({ page })}
          onPageSizeChange={(pageSize) => onInputChange({ pageSize, page: 1 })}
        />
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <form className="flex h-full flex-col" onSubmit={submitUser}>
            <DrawerHeader>
              <DrawerTitle>{editing ? "Update user" : "Add user"}</DrawerTitle>
              <DrawerDescription>
                {editing
                  ? "Edit the selected DummyJSON user."
                  : "Create a simulated user through /users/add."}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <input
                    required
                    value={form.firstName}
                    onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                    className="field-input"
                  />
                </Field>
                <Field label="Last name">
                  <input
                    required
                    value={form.lastName}
                    onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                    className="field-input"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="field-input"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    required
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="field-input"
                  />
                </Field>
                <Field label="Age">
                  <input
                    required
                    type="number"
                    min={18}
                    max={120}
                    value={form.age}
                    onChange={(event) => setForm({ ...form, age: Number(event.target.value) })}
                    className="field-input"
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={(event) =>
                      setForm({ ...form, gender: event.target.value as "female" | "male" })
                    }
                    className="field-input"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </Field>
                <Field label="Role">
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value as CreateUserInput["role"] })
                    }
                    className="field-input"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </Field>
                <Field label="Department">
                  <input
                    required
                    value={form.department}
                    onChange={(event) => setForm({ ...form, department: event.target.value })}
                    className="field-input"
                  />
                </Field>
                <Field label="Job title">
                  <input
                    required
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    className="field-input"
                  />
                </Field>
              </div>
              {formError ? (
                <Alert variant="destructive" className="mt-5">
                  <AlertTitle>Unable to save user</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              ) : null}
            </DrawerBody>
            <DrawerFooter>
              <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                {addMutation.isPending || updateMutation.isPending ? "Saving…" : "Save user"}
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete user?"
        description={
          deleting
            ? `This will simulate deleting ${deleting.firstName} ${deleting.lastName}.`
            : "Delete the selected user."
        }
        pending={deleteMutation.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
