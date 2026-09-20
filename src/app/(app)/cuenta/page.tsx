import { requireUser } from "@/lib/auth";
import { signOut } from "../actions";
import { rajdhani } from "../fonts";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import IntervalsForm from "./IntervalsForm";
import { Card, SectionTitle } from "../ui";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  coach: "Coach",
  fisico: "Preparador físico",
  nutricionista: "Nutricionista",
  athlete: "Atleta",
};

export default async function CuentaPage() {
  const { supabase, user, profile } = await requireUser();

  const { data: integ } = await supabase
    .from("integrations")
    .select("intervals_athlete_id, intervals_api_key, last_synced_at")
    .eq("profile_id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className={`${rajdhani.className} text-2xl font-bold`}>Mi cuenta</h2>
        <p className="mt-1 text-sm text-brand-text">{ROLE_LABEL[profile?.role ?? ""] ?? ""}</p>
      </div>

      <Card className="space-y-4">
        <span className="block text-xs font-medium text-ink-2">Correo</span>
        <p className="text-sm text-ink">{user.email}</p>
        <ProfileForm
          fullName={profile?.full_name ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
          bio={profile?.bio ?? ""}
        />
      </Card>

      <Card className="space-y-4">
        <SectionTitle>Contraseña</SectionTitle>
        <PasswordForm email={user.email!} />
      </Card>

      {profile?.role === "athlete" && (
        <Card className="space-y-4">
          <div>
            <SectionTitle
              hint="Trae tus entrenamientos de los últimos 60 días a Kurku. Tu API key está en intervals.icu → Settings → Developer."
            >
              Intervals.icu
            </SectionTitle>
          </div>
          <IntervalsForm
            athleteId={integ?.intervals_athlete_id ?? ""}
            apiKey={integ?.intervals_api_key ?? ""}
            lastSyncedAt={integ?.last_synced_at ?? null}
          />
        </Card>
      )}

      <form action={signOut}>
        <button className="text-sm text-ink-3 hover:text-bad-text hover:underline">
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
