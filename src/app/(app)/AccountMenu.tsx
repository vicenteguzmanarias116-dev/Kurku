"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mono } from "./fonts";
import { signOut } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  coach: "Coach",
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
    <div ref={ref} className="relative ml-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full transition hover:opacity-80"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-9 w-9 rounded-full border border-white/15 object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-bold text-cyan-300">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="cut-corner absolute right-0 top-full z-30 mt-2 w-48 border border-cyan-400/20 bg-[#0D141E] py-2 shadow-xl shadow-black/50">
          <div className="border-b border-white/10 px-4 py-2">
            <p className="truncate text-sm text-white/80">{fullName}</p>
            {role && (
              <p
                className={`${mono.className} text-[10px] uppercase tracking-widest text-cyan-300`}
              >
                {ROLE_LABEL[role] ?? role}
              </p>
            )}
          </div>
          <Link
            href="/cuenta"
            onClick={() => setOpen(false)}
            className={`${mono.className} block px-4 py-2 text-xs uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white`}
          >
            Mi cuenta
          </Link>
          <form action={signOut}>
            <button
              className={`${mono.className} block w-full px-4 py-2 text-left text-xs uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-[#FF5A36]`}
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
