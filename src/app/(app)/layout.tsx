import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import { signOut } from "./actions";
import { rajdhani, mono } from "./fonts";

const NAV = [
  { href: "/dashboard", label: "Panel" },
  { href: "/atletas", label: "Atletas" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/calendario", label: "Calendario" },
  { href: "/comunicacion", label: "Comunicación" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireUser();
  if (!profile?.team_id) redirect("/equipo/nuevo");

  return (
    <div className="flex flex-1 flex-col bg-[#05080D] text-[#EAF2F6]">
      <header className="flex items-center gap-6 border-b border-white/10 bg-[#0D141E] px-6 py-4 sm:px-10">
        <Link
          href="/dashboard"
          className={`${rajdhani.className} flex items-center gap-2 text-lg font-bold tracking-wide`}
        >
          <span className="h-2 w-2 bg-[#FF5A36]" />
          KURKU
        </Link>
        <nav
          className={`${mono.className} hidden gap-5 text-xs uppercase tracking-wider text-white/50 sm:flex`}
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="transition hover:text-cyan-300"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="ml-auto flex items-center gap-4">
          <span
            className={`${mono.className} hidden text-xs uppercase tracking-wider text-white/40 sm:inline`}
          >
            {profile?.full_name ?? ""}
            {isStaff(profile) && (
              <span className="ml-2 border border-cyan-400/30 px-1.5 py-0.5 text-cyan-300">
                staff
              </span>
            )}
          </span>
          <button
            className={`${mono.className} text-xs uppercase tracking-wider text-white/50 transition hover:text-[#FF5A36]`}
          >
            Salir
          </button>
        </form>
      </header>
      <nav
        className={`${mono.className} flex gap-4 overflow-x-auto border-b border-white/10 bg-[#0D141E] px-6 py-2.5 text-xs uppercase tracking-wider text-white/50 sm:hidden`}
      >
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="whitespace-nowrap transition hover:text-cyan-300"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}
