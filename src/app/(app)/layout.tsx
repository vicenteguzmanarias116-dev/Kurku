import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser, isAdmin } from "@/lib/auth";
import { rajdhani, mono } from "./fonts";
import AccountMenu from "./AccountMenu";
import HeaderSettings from "./HeaderSettings";
import { OPTIONAL_MODULES } from "./modules";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, profile } = await requireUser();
  if (!profile?.team_id) redirect("/equipo/nuevo");

  const { data: team } = await supabase
    .from("teams")
    .select("name, logo_url, description, hidden_modules")
    .eq("id", profile.team_id)
    .single<{
      name: string;
      logo_url: string | null;
      description: string | null;
      hidden_modules: string[];
    }>();

  const hidden = new Set(team?.hidden_modules ?? []);
  const NAV = [
    { href: "/pagina-equipo", label: "Página del equipo" },
    { href: "/dashboard", label: "Panel" },
    ...OPTIONAL_MODULES.filter((m) => !hidden.has(m.key)).map((m) => ({
      href: m.href,
      label: m.label,
    })),
    ...(isAdmin(profile) ? [{ href: "/equipo/miembros", label: "Miembros" }] : []),
  ];

  return (
    <div className="relative flex flex-1 flex-col bg-[#05080D] text-[#EAF2F6]">
      {/* fondo de vela sutil, comparte lenguaje con el Hero del index */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Image
          src="/hero/navegando-sunset.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.10]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080D]/80 via-[#05080D]/92 to-[#05080D]" />
        <div className="radar-grid absolute inset-0 opacity-50" />
      </div>
      <div className="scanline pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

      <header className="relative z-40 flex items-center gap-6 border-b border-white/10 bg-[#0D141E]/85 px-6 py-4 backdrop-blur-sm sm:px-10">
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
        className={`${mono.className} relative z-40 flex gap-4 overflow-x-auto border-b border-white/10 bg-[#0D141E]/85 px-6 py-2.5 text-xs uppercase tracking-wider text-white/50 backdrop-blur-sm sm:hidden`}
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

      {/* ola: motivo marítimo que enlaza con el Hero */}
      <svg
        className="relative z-10 h-8 w-full text-[#FF5A36]/25"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 20 Q150 0 300 20 T600 20 T900 20 T1200 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <main className="relative z-10 flex-1 px-6 pb-10 pt-4 sm:px-10">
        {children}
      </main>
    </div>
  );
}
