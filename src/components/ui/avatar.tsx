"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Drop your image at `public/avatars/default-avatar.jpeg`. If you use a
 * different filename or format, change this one constant.
 */
export const DEFAULT_AVATAR_SRC = "/avatars/default-avatar.jpeg";

/**
 * A user's picture, falling back to the default image.
 *
 * The fallback covers two cases, not one: users with no picture at all, and a
 * `src` that fails to load — Google's avatar CDN 403s often enough that a
 * server-side null check alone leaves people with a broken-image icon.
 */
export function Avatar({
  src,
  alt = "",
  size = 28,
  className,
}: {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = !src || failed ? DEFAULT_AVATAR_SRC : src;

  return (
    <Image
      src={resolved}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      // Avatars are small and come from an external host; optimizing them
      // would burn Vercel image transforms for no visible gain.
      unoptimized
      className={cn(
        "rounded-full bg-slate-200 object-cover dark:bg-slate-700",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
