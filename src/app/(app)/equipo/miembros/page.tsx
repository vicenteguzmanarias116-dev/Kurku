import { redirect } from "next/navigation";
import { requireUser, isAdmin } from "@/lib/auth";
import { mono } from "../../fonts";
import PageHead from "../../PageHead";
import { removeMember } from "../actions";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  coach: "Coach",
  athlete: "Atleta",
};

type Member = {
  id: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
};

export default async function MiembrosPage() {
  const { supabase, user, profile } = await requireUser();
  if (!isAdmin(profile)) redirect("/dashboard");

  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url")
    .eq("team_id", profile!.team_id)
    .order("role");

  return (
    <div className="max-w-lg space-y-6">
      <PageHead eyebrow="Staff · Atletas" title="Miembros del equipo" />

      <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0D141E]/80">
        {(members as Member[] | null)?.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-5 py-3">
            {m.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.avatar_url}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-bold text-cyan-300">
                {(m.full_name || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/80">{m.full_name || "—"}</p>
              <p className={`${mono.className} text-[10px] uppercase tracking-widest text-white/40`}>
                {ROLE_LABEL[m.role] ?? m.role}
              </p>
            </div>
            {m.id !== user.id && (
              <form action={removeMember}>
                <input type="hidden" name="id" value={m.id} />
                <button className="text-xs text-red-400 hover:underline">
                  sacar del equipo
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
