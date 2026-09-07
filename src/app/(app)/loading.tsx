export default function AppLoading() {
  return (
    <div className="space-y-4" aria-busy role="status" aria-label="Loading">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
