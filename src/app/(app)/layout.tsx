import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser, isAdmin } from "@/lib/auth";
import { rajdhani } from "./fonts";
import AccountMenu from "./AccountMenu";
import HeaderSettings from "./HeaderSettings";
import { OPTIONAL_MODULES } from "./modules";
import HealthReminderModal from "./HealthReminderModal";
import NavIcon from "./NavIcon";

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

  let needsHealthCheckin = false;
  if (profile.role === "athlete" && !hidden.has("salud")) {
    const { data: myAthlete } = await supabase
      .from("athletes")
      .select("id")
      .eq("profile_id", profile.id)
      .maybeSingle();
    if (myAthlete) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: checkin } = await supabase
        .from("health_checkins")
        .select("id")
        .eq("athlete_id", myAthlete.id)
        .eq("checkin_date", today)
        .maybeSingle();
      needsHealthCheckin = !checkin;
    }
  }

  const NAV = [
    { href: "/pagina-equipo", label: "Página del equipo", key: "pagina-equipo" },
    { href: "/dashboard", label: "Panel", key: "dashboard" },
    ...OPTIONAL_MODULES.filter((m) => !hidden.has(m.key)).map((m) => ({
      href: m.href,
      label: m.label,
      key: m.key,
    })),
  ];

  const navLink =
    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition hover:bg-sunken hover:text-ink";

  return (
    <div className="flex flex-1 flex-col bg-canvas text-ink">
      <header className="flex items-center gap-6 border-b border-line bg-surface px-6 py-3 sm:px-10">
        <div className="group relative flex shrink-0 items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
          >
            {team?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.logo_url}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full border border-line object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-text">
                {(team?.name ?? "K").charAt(0).toUpperCase()}
              </span>
            )}
            <span
              className={`${rajdhani.className} truncate text-xl font-bold sm:text-2xl`}
            >
              {team?.name ?? "Kurku"}
            </span>
          </Link>

          {team?.description && (
            <div
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full z-30 mt-3 w-max max-w-[280px] -translate-y-1 rounded-xl border border-line border-l-4 border-l-brand bg-surface px-3.5 py-2.5 text-sm leading-snug text-ink-2 opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
              {team.description}
            </div>
          )}
        </div>

        <nav
          className={`${rajdhani.className} hidden gap-1 text-sm font-medium text-ink-2 lg:flex`}
        >
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={navLink}>
              <NavIcon name={n.key} className="h-4 w-4 shrink-0" />
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {isAdmin(profile) && <HeaderSettings />}
          <AccountMenu
            fullName={profile?.full_name ?? null}
            role={profile?.role}
            avatarUrl={profile?.avatar_url ?? null}
          />
        </div>
      </header>

      <nav
        className={`${rajdhani.className} flex gap-1 overflow-x-auto border-b border-line bg-surface px-4 py-2 text-sm font-medium text-ink-2 lg:hidden`}
      >
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`${navLink} shrink-0 whitespace-nowrap`}
          >
            <NavIcon name={n.key} className="h-4 w-4 shrink-0" />
            {n.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 px-6 pb-12 pt-6 sm:px-10">{children}</main>

      <HealthReminderModal show={needsHealthCheckin} />
    </div>
  );
}
