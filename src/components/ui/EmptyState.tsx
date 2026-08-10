export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-paper-soft px-6 py-12 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
