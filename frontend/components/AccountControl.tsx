"use client";

/* The sign-in entry point everywhere except /login itself.

   Before this component, "Sign in with GitHub" only existed on the /login
   page — nothing on the landing page or anywhere else linked to it, so a
   visitor who didn't already know that URL had no way to find it. Mounted
   once in the root layout, this renders in the same fixed corner on every
   route: a "Sign in" pill when signed out, the account's avatar + login +
   a "Sign out" action when signed in.

   Three states, same as `useSession` exposes:
     loading        → render nothing (avoids a flash of the wrong state)
     user === null  → the sign-in pill
     user           → avatar, handle, sign-out
*/

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { githubLoginUrl, logout } from "@/lib/api";
import { useSession } from "@/lib/useSession";

export function AccountControl() {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  if (loading) return null;

  // /login already puts its own centered "Sign in with GitHub" button front
  // and center — a second copy in the corner would just be noise there.
  if (!user && pathname === "/login") return null;

  if (!user) {
    return (
      <a
        href={githubLoginUrl()}
        className="glass fixed top-4 right-4 z-50 flex items-center gap-2 border-parchment/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-parchment transition-colors hover:bg-white/10 sm:top-6 sm:right-6 sm:text-xs"
      >
        Sign in with GitHub
      </a>
    );
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="glass fixed top-4 right-4 z-50 flex items-center gap-3 border-parchment/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-parchment sm:top-6 sm:right-6 sm:text-xs">
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- a tiny
        // 24px avatar isn't worth routing through next/image's optimizer,
        // and next.config's `unoptimized: true` means there's no cost to
        // skip either way.
        <img
          src={user.avatar_url}
          alt=""
          width={20}
          height={20}
          className="rounded-full"
        />
      ) : null}
      <span className="normal-case tracking-normal text-parchment/90">
        {user.github_login}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="text-muted transition-colors hover:text-parchment disabled:opacity-50"
      >
        {signingOut ? "…" : "Sign out"}
      </button>
    </div>
  );
}
