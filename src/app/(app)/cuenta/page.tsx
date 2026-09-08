import { requireUser } from "@/lib/auth";
import { signOut } from "../actions";
import { rajdhani, mono } from "../fonts";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import IntervalsForm from "./IntervalsForm";

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
    <div className="max-w-md space-y-8">
      <div>
        <h2 className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}>
          Mi cuenta
        </h2>
        <p className={`${mono.className} mt-1 text-xs uppercase tracking-wider text-cyan-300`}>
          {ROLE_LABEL[profile?.role ?? ""] ?? ""}
        </p>
      </div>

      <section className="cut-corner space-y-4 border border-cyan-400/20 bg-[#0D141E] p-6">
        <span
          className={`${mono.className} block text-xs uppercase tracking-wider text-white/40`}
        >
          Correo
        </span>
        <p className="text-sm text-white/80">{user.email}</p>
        <ProfileForm
          fullName={profile?.full_name ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
          bio={profile?.bio ?? ""}
        />
      </section>

      <section className="cut-corner space-y-4 border border-cyan-400/20 bg-[#0D141E] p-6">
        <h3 className={`${mono.className} text-xs uppercase tracking-wider text-white/40`}>
          Contraseña
        </h3>
        <PasswordForm email={user.email!} />
      </section>

      {profile?.role === "athlete" && (
        <section className="cut-corner space-y-4 border border-cyan-400/20 bg-[#0D141E] p-6">
          <div>
            <h3 className={`${mono.className} text-xs uppercase tracking-wider text-white/40`}>
              Intervals.icu
            </h3>
            <p className="mt-1 text-xs text-white/40">
              Trae tus entrenamientos de los últimos 60 días a Kurku. Tu API
              key está en intervals.icu → Settings → Developer.
            </p>
          </div>
          <IntervalsForm
            athleteId={integ?.intervals_athlete_id ?? ""}
            apiKey={integ?.intervals_api_key ?? ""}
            lastSyncedAt={integ?.last_synced_at ?? null}
          />
        </section>
      )}

      <form action={signOut}>
        <button className="text-sm text-white/50 hover:text-[#FF5A36] hover:underline">
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
