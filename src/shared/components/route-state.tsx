import { Alert, AlertDescription, AlertTitle } from "#/shared/components/ui/alert";
import { Button } from "#/shared/components/ui/button";

export function RoutePendingState({ label = "Loading…" }: { label?: string }) {
  return <div className="grid min-h-[40vh] place-items-center"><p className="text-sm text-muted-foreground">{label}</p></div>;
}

export function RouteErrorState({ error, reset }: { error: Error; reset: () => void }) {
  return <div className="mx-auto max-w-xl py-10"><Alert variant="destructive"><AlertTitle>Unable to load this screen</AlertTitle><AlertDescription>{error.message}</AlertDescription><div className="mt-3"><Button type="button" variant="outline" onClick={reset}>Try again</Button></div></Alert></div>;
}
