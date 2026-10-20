"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavIcon from "./NavIcon";
import { rajdhani } from "./fonts";
import type { NavItem } from "./modules";

export default function SideNav({
  primary,
  more,
}: {
  primary: NavItem[];
  more: NavItem[];
}) {
  const pathname = usePathname();

  const item = (n: NavItem) => {
    const active = pathname.startsWith(n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
          active ? "bg-brand-soft text-brand-text" : "text-ink-2 hover:bg-sunken hover:text-ink"
        }`}
      >
        <NavIcon name={n.key} className="h-[18px] w-[18px] shrink-0" />
        {n.label}
      </Link>
    );
  };

  return (
    <nav className={`${rajdhani.className} flex-1 space-y-0.5 overflow-y-auto px-3 py-2 text-sm font-medium`}>
      {primary.map(item)}
      {more.length > 0 && <p className="px-3 pb-1 pt-5 text-xs font-normal text-ink-3">Más</p>}
      {more.map(item)}
    </nav>
  );
}
