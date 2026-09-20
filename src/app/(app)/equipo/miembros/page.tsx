import { redirect } from "next/navigation";
import { requireUser, isAdmin } from "@/lib/auth";
import PageHead from "../../PageHead";
import { removeMember, setMemberRole } from "../actions";
import { Card, Select, Button } from "../../ui";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  coach: "Coach",
  fisico: "Preparador físico",
  nutricionista: "Nutricionista",
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

      <Card className="p-0">
        <div className="divide-y divide-line">
          {(members as Member[] | null)?.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-5 py-3">
              {m.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.avatar_url}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full border border-line object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-text">
                  {(m.full_name || "?").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{m.full_name || "—"}</p>
                <p className="text-xs text-ink-3">{ROLE_LABEL[m.role] ?? m.role}</p>
              </div>
              <form action={setMemberRole} className="flex items-center gap-1.5">
                <input type="hidden" name="id" value={m.id} />
                <Select name="role" defaultValue={m.role} className="py-1.5 text-xs">
                  <option value="athlete">Atleta</option>
                  <option value="coach">Coach</option>
                  <option value="fisico">Preparador físico</option>
                  <option value="nutricionista">Nutricionista</option>
                  <option value="admin">Administrador</option>
                </Select>
                <Button size="sm">Guardar</Button>
              </form>
              {m.id !== user.id && (
                <form action={removeMember}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="text-xs text-bad-text hover:underline">
                    sacar del equipo
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
