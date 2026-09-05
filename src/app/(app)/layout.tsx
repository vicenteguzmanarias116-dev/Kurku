import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser, isAdmin } from "@/lib/auth";
import { rajdhani, mono } from "./fonts";
import AccountMenu from "./AccountMenu";
import HeaderSettings from "./HeaderSettings";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, profile } = await requireUser();
  if (!profile?.team_id) redirect("/equipo/nuevo");

  const NAV = [
    { href: "/pagina-equipo", label: "Página del equipo" },
    { href: "/dashboard", label: "Panel" },
    { href: "/atletas", label: "Atletas" },
    { href: "/entrenamientos", label: "Entrenamientos" },
    { href: "/calendario", label: "Calendario" },
    ...(isAdmin(profile) ? [{ href: "/equipo/miembros", label: "Miembros" }] : []),
  ];

  const { data: team } = await supabase
    .from("teams")
    .select("name, logo_url, description")
    .eq("id", profile.team_id)
    .single<{ name: string; logo_url: string | null; description: string | null }>();

  return (
    <div className="flex flex-1 flex-col bg-[#05080D] text-[#EAF2F6]">
      <header className="flex items-center gap-6 border-b border-white/10 bg-[#0D141E] px-6 py-4 sm:px-10">
        <div className="group relative flex shrink-0 items-center">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            {team?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.logo_url}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#FF5A36]/40 bg-[#FF5A36]/10 text-sm font-bold text-[#FF5A36]">
                {(team?.name ?? "K").charAt(0).toUpperCase()}
              </span>
            )}
            <span
              className={`${rajdhani.className} truncate text-xl font-bold tracking-wide sm:text-2xl`}
            >
              {team?.name ?? "Kurku"}
            </span>
          </Link>

          {team?.description && (
            <div
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full z-30 mt-3 w-max max-w-[280px] -translate-y-1 border border-white/10 border-l-2 border-l-[#FF5A36] bg-[#0D141E] px-3.5 py-2.5 text-sm leading-snug text-white/70 opacity-0 shadow-xl shadow-black/50 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
              {team.description}
            </div>
          )}
        </div>
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
        <div className="ml-auto flex items-center gap-4">
          <span
            className={`${mono.className} hidden items-center gap-1 text-[10px] uppercase tracking-widest text-white/25 md:inline-flex`}
          >
            <span className="h-1.5 w-1.5 bg-[#FF5A36]/60" />
            Kurku
          </span>
          {isAdmin(profile) && <HeaderSettings />}
          <AccountMenu
            fullName={profile?.full_name ?? null}
            role={profile?.role}
            avatarUrl={profile?.avatar_url ?? null}
          />
        </div>
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
