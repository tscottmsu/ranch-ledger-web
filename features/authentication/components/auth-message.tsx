export function AuthMessage({ state }: { state: { status: "idle" | "error" | "success"; message?: string } }) {
  if (!state.message) return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={state.status === "error" ? "rounded-lg bg-destructive/10 p-3 text-sm text-destructive" : "rounded-lg bg-primary/10 p-3 text-sm text-primary"}
    >
      {state.message}
    </p>
  );
}
