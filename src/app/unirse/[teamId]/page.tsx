import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { display as rajdhani, mono } from "../../fonts";
import JoinButton from "./JoinButton";

export default async function JoinTeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .rpc("team_public_info", { p_team_id: teamId })
    .maybeSingle<{ name: string; logo_url: string | null }>();
  if (!team) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyOnTeam = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", user.id)
      .maybeSingle();
    alreadyOnTeam = !!profile?.team_id;
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#05080D] px-6 py-16 text-[#EAF2F6]">
      <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />

      <Link
        href="/"
        className={`${rajdhani.className} relative z-10 mb-10 flex items-center gap-2 text-xl font-bold tracking-wide`}
      >
        <span className="h-2.5 w-2.5 bg-[#FF5A36]" />
        KURKU
      </Link>

      <div className="cut-corner relative z-10 w-full max-w-sm border border-[#FF5A36]/20 bg-[#0D141E]/80 p-8 text-center backdrop-blur">
        <span
          className={`${mono.className} mb-2 block text-[11px] uppercase tracking-widest text-[#FF5A36]`}
        >
          Invitación
        </span>

        {team.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={team.logo_url}
            alt=""
            className="mx-auto mb-4 h-16 w-16 rounded-full border border-white/15 object-cover"
          />
        ) : (
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[#FF5A36]/40 bg-[#FF5A36]/10 text-2xl font-bold text-[#FF5A36]">
            {team.name.charAt(0).toUpperCase()}
          </span>
        )}

        <h1
          className={`${rajdhani.className} mb-4 text-3xl font-bold uppercase leading-none`}
        >
          {team.name}
        </h1>

        {!user ? (
          <>
            <p className="mb-6 text-sm text-white/60">
              Necesitas una cuenta para unirte como atleta.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(`/unirse/${teamId}`)}`}
              className="cut-corner inline-block w-full bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition-all hover:scale-[1.03] hover:bg-[#ff7154] hover:shadow-lg hover:shadow-[#FF5A36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
            >
              Entrar o crear cuenta
            </Link>
          </>
        ) : alreadyOnTeam ? (
          <p className="text-sm text-white/60">
            Ya perteneces a un equipo. No puedes unirte a otro.
          </p>
        ) : (
          <JoinButton teamId={teamId} />
        )}
      </div>
    </main>
  );
}
