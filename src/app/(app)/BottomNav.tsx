"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavIcon from "./NavIcon";
import type { NavItem } from "./modules";

export default function BottomNav({
  primary,
  more,
}: {
  primary: NavItem[];
  more: NavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="absolute bottom-16 left-0 right-0 rounded-t-2xl border-t border-line bg-surface p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {more.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-2 hover:bg-sunken"
              >
                <NavIcon name={item.key} className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {primary.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                active ? "text-brand-text" : "text-ink-3"
              }`}
            >
              <NavIcon name={item.key} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        {more.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              open ? "text-brand-text" : "text-ink-3"
            }`}
          >
            <NavIcon name="mas" className="h-5 w-5" />
            Más
          </button>
        )}
      </nav>
    </>
  );
}
