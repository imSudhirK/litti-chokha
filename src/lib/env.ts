import { z } from "zod";

/**
 * Environment access, validated once at import time so a missing variable
 * fails the build with a readable message instead of surfacing as a confusing
 * runtime error deep inside the Supabase client.
 *
 * `process.env.X` must be written out literally — Next inlines NEXT_PUBLIC_*
 * variables by static text match, so `process.env[key]` would not survive the
 * client bundle.
 */
const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => issue.path.join("."))
    .join(", ");
  throw new Error(
    `Invalid or missing environment variables: ${missing}. ` +
      `Copy .env.example to .env.local and fill it in.`,
  );
}

export const env = parsed.data;
