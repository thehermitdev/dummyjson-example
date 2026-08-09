import { UserButton } from "@clerk/react";

export function ClerkProfile() {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-background/70 p-2">
      <UserButton showName afterSignOutUrl="/" />
    </div>
  );
}
