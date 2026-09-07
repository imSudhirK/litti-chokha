import { GoogleSignInButton } from "./google-sign-in-button";

const ERRORS: Record<string, string> = {
  not_invited:
    "That Google account isn't on the invite list. Ask the owner to add your email, then try again.",
  missing_code: "The sign-in link was incomplete. Please try again.",
  sign_in_failed: "Sign-in didn't complete. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? (ERRORS[error] ?? ERRORS.sign_in_failed) : null;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Litti Chokha
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Your todos and habits, in one place. Invite only.
          </p>

          {message ? (
            <p
              role="alert"
              className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200"
            >
              {message}
            </p>
          ) : null}

          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>
      </div>
    </main>
  );
}
