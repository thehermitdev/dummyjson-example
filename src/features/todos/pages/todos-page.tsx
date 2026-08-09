import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createTodoInputSchema } from "../api/contracts";
import {
  addTodoMutationOptions,
  deleteTodoMutationOptions,
  updateTodoMutationOptions,
} from "../api/mutations";
import type { CreateTodoInput, Todo, TodosListResponse } from "../api/contracts";
import type { TodosListInput } from "../api/queries";
import { FetchingSkeletonBar } from "#/shared/components/api-skeletons";
import { ConfirmDeleteDialog } from "#/shared/components/confirm-delete-dialog";
import { DataPagination } from "#/shared/components/data-pagination";
import { RouterButton } from "#/shared/components/navigation/router-button";
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

interface TodosPageProps {
  data: TodosListResponse;
  input: TodosListInput;
  users: Array<UserOption>;
  isFetching?: boolean;
  onInputChange: (next: Partial<TodosListInput>) => void;
}

const emptyForm: CreateTodoInput = { todo: "", completed: false, userId: 1 };

export function TodosPage({
  data,
  input,
  users,
  isFetching = false,
  onInputChange,
}: TodosPageProps) {
  const queryClient = useQueryClient();
  const addMutation = useMutation(addTodoMutationOptions(queryClient));
  const updateMutation = useMutation(updateTodoMutationOptions(queryClient));
  const deleteMutation = useMutation(deleteTodoMutationOptions(queryClient));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Todo | null>(null);
  const [form, setForm] = React.useState<CreateTodoInput>(emptyForm);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<Todo | null>(null);

  const userMap = React.useMemo(
    () => new Map(users.map((user) => [user.id, `${user.firstName} ${user.lastName}`])),
    [users],
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, userId: users[0]?.id ?? 1 });
    setFormError(null);
    setDrawerOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditing(todo);
    setForm({ todo: todo.todo, completed: todo.completed, userId: todo.userId });
    setFormError(null);
    setDrawerOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = createTodoInputSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please review the task fields.");
      return;
    }

    setFormError(null);
    try {
      if (editing) {
        await updateMutation.mutateAsync({ todo: editing, input: parsed.data });
        toast.success("Task updated");
      } else {
        await addMutation.mutateAsync(parsed.data);
        toast.success("Task created", {
          description: `Assigned to ${userMap.get(parsed.data.userId) ?? `User #${parsed.data.userId}`}.`,
        });
      }
      setDrawerOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save task.");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success("Task deleted");
      setDeleting(null);
    } catch (error) {
      toast.error("Delete failed", {
        description: error instanceof Error ? error.message : "Unable to delete task.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Task Management</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Treat DummyJSON todos as an internal task assignment system.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" /> Add Task
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={input.userId ?? ""}
            onChange={(event) =>
              onInputChange({
                userId: event.target.value ? Number(event.target.value) : undefined,
                page: 1,
              })
            }
            className="h-9 min-w-64 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">{data.total} tasks</p>
        </div>

        <FetchingSkeletonBar show={isFetching} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Assigned to</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.todos.map((todo) => (
                <tr key={todo.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <RouterButton
                      to="/todos/$todoId"
                      params={{ todoId: String(todo.id) }}
                      variant="link"
                      className="h-auto justify-start p-0 font-medium"
                    >
                      {todo.todo}
                    </RouterButton>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {userMap.get(todo.userId) ?? `User #${todo.userId}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${todo.completed ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}
                    >
                      {todo.completed ? "Completed" : "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <RouterButton
                        to="/todos/$todoId"
                        params={{ todoId: String(todo.id) }}
                        variant="ghost"
                        size="icon-sm"
                      >
                        <Eye className="size-4" />
                        <span className="sr-only">View task</span>
                      </RouterButton>
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(todo)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit task</span>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(todo)}>
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete task</span>
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
          <form className="flex h-full flex-col" onSubmit={submit}>
            <DrawerHeader>
              <DrawerTitle>{editing ? "Update task" : "Add task"}</DrawerTitle>
              <DrawerDescription>
                Choose the assignee by name; the API receives the user ID.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm font-medium">
                  <span>Task</span>
                  <textarea
                    required
                    rows={6}
                    value={form.todo}
                    onChange={(event) => setForm({ ...form, todo: event.target.value })}
                    className="field-input min-h-32"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  <span>Assigned to</span>
                  <select
                    value={form.userId}
                    onChange={(event) => setForm({ ...form, userId: Number(event.target.value) })}
                    className="field-input"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.completed}
                    onChange={(event) => setForm({ ...form, completed: event.target.checked })}
                  />
                  <span>Mark as completed</span>
                </label>
              </div>

              {formError ? (
                <Alert variant="destructive" className="mt-5">
                  <AlertTitle>Unable to save task</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              ) : null}
            </DrawerBody>
            <DrawerFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDrawerOpen(false)}
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                {addMutation.isPending || updateMutation.isPending ? "Saving…" : "Save task"}
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete task?"
        description={
          deleting
            ? `Delete “${deleting.todo}” from the current demo session?`
            : "Delete this task?"
        }
        pending={deleteMutation.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
