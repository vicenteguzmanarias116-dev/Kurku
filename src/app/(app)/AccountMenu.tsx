"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  coach: "Coach",
  fisico: "Prep. físico",
  nutricionista: "Nutricionista",
  athlete: "Atleta",
};

export default function AccountMenu({
  fullName,
  role,
  avatarUrl,
}: {
  fullName: string | null;
  role: string | undefined;
  avatarUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const initial = (fullName || "?").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full transition hover:opacity-80"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-9 w-9 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunken text-sm font-bold text-ink-2">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-lg">
          <div className="border-b border-line px-4 py-2.5">
            <p className="truncate text-sm font-medium text-ink">{fullName}</p>
            {role && (
              <p className="text-xs text-ink-3">{ROLE_LABEL[role] ?? role}</p>
            )}
          </div>
          <Link
            href="/cuenta"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink-2 hover:bg-sunken hover:text-ink"
          >
            Mi cuenta
          </Link>
          <form action={signOut}>
            <button className="block w-full px-4 py-2.5 text-left text-sm text-ink-2 hover:bg-sunken hover:text-bad-text">
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
