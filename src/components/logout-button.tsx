"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
    >
      Logout
    </button>
  );
}
