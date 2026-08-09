import { UserButton } from "@clerk/react";

export function ClerkProfile({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex justify-center" : "rounded-lg border bg-background/70 p-2"}>
      <UserButton showName={!compact} />
    </div>
  );
}
