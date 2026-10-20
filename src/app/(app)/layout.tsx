import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser, isAdmin } from "@/lib/auth";
import { rajdhani } from "./fonts";
import AccountMenu from "./AccountMenu";
import HeaderSettings from "./HeaderSettings";
import { navFor } from "./modules";
import BottomNav from "./BottomNav";
import SideNav from "./SideNav";

const PREVIEW_LABEL: Record<string, string> = {
  coach: "Coach",
  fisico: "Preparador físico",
  nutricionista: "Nutricionista",
  athlete: "Atleta",
};

type Team = {
  name: string;
  logo_url: string | null;
  description: string | null;
  hidden_modules: string[];
};

function Brand({ team }: { team: Team | null }) {
  return (
    <div className="group relative flex shrink-0 items-center">
      <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
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
        <span className={`${rajdhani.className} truncate text-xl font-bold`}>
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
  );
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, profile, realProfile, previewRole } = await requireUser();
  if (!profile?.team_id) redirect("/equipo/nuevo");

  const { data: team } = await supabase
    .from("teams")
    .select("name, logo_url, description, hidden_modules")
    .eq("id", profile.team_id)
    .single<Team>();

  const hidden = new Set(team?.hidden_modules ?? []);
  const { primary, more } = navFor(profile.role, hidden);

  const account = (up: boolean) => (
    <>
      {isAdmin(realProfile) && <HeaderSettings up={up} />}
      <AccountMenu
        up={up}
        fullName={profile?.full_name ?? null}
        role={profile?.role}
        avatarUrl={profile?.avatar_url ?? null}
      />
    </>
  );

  return (
    <div className="flex flex-1 bg-canvas text-ink">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="px-5 py-5">
          <Brand team={team} />
        </div>
        <SideNav primary={primary} more={more} />
        <div className="flex items-center gap-2 border-t border-line px-5 py-4">
          {account(true)}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative z-20 flex items-center gap-3 border-b border-line bg-surface px-6 py-3 sm:px-10 lg:hidden">
          <Brand team={team} />
          <div className="ml-auto flex items-center gap-3">{account(false)}</div>
        </header>

        {previewRole && (
          <div className="flex items-center justify-between gap-3 bg-brand-strong px-6 py-2 text-sm text-white sm:px-10">
            <span>
              Vista previa: viendo como <strong>{PREVIEW_LABEL[previewRole]}</strong>
            </span>
            <Link href="/api/preview-role" className="underline underline-offset-2 hover:no-underline">
              Salir de la vista previa
            </Link>
          </div>
        )}

        <main className="flex-1 px-6 pb-24 pt-6 sm:px-10 lg:pb-10">{children}</main>

        <BottomNav primary={primary} more={more} />
      </div>
    </div>
  );
}
