import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireUser, isStaff, isAdmin } from "@/lib/auth";
import { rajdhani, mono } from "../fonts";
import PostButton from "./PostButton";
import TeamGallery from "./TeamGallery";

type Ann = {
  id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
};

async function post(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  const { error } = await supabase
    .from("announcements")
    .insert({ team_id: profile!.team_id, author_id: profile!.id, body });
  if (error) throw new Error(error.message);
  revalidatePath("/pagina-equipo");
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `hace ${day} d`;
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
  });
}

export default async function PaginaEquipoPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const { editar } = await searchParams;
  const editing = isAdmin(profile) && editar === "1";
  const [{ data: items }, { data: team }] = await Promise.all([
    supabase
      .from("announcements")
      .select("id, body, created_at, profiles(full_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("teams")
      .select("gallery_urls")
      .eq("id", profile!.team_id)
      .single<{ gallery_urls: string[] }>(),
  ]);

  return (
    <div className="space-y-4">
      {editing && (
        <div className="cut-corner flex flex-wrap items-center justify-between gap-3 border border-cyan-400/40 bg-cyan-400/[0.06] px-4 py-3 text-sm">
          <span className={`${mono.className} text-xs uppercase tracking-wider text-cyan-300`}>
            Modo personalización
          </span>
          <Link
            href="/pagina-equipo"
            className={`${mono.className} text-xs uppercase tracking-wider text-white/60 hover:text-white`}
          >
            Salir
          </Link>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}>
              Página del equipo
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Avisos de regata, entrenamiento físico, nutrición o del club — lo
              último que publicó el staff.
            </p>
          </div>
          <span
            className={`${mono.className} hidden shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-widest text-cyan-300 sm:flex`}
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
            En vivo
          </span>
        </div>

        {isStaff(profile) && (
        <form
          action={post}
          className="hud-frame cut-corner relative space-y-3 border border-cyan-400/20 bg-[#0D141E] p-5"
        >
          <span
            className={`${mono.className} block text-[10px] uppercase tracking-widest text-white/40`}
          >
            Nuevo aviso
          </span>
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Aviso para el equipo…"
            className="w-full resize-none border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
          />
          <PostButton />
        </form>
      )}

      <ul className="space-y-3">
        {(items as Ann[] | null)?.map((a) => (
          <li
            key={a.id}
            className="hud-frame cut-corner relative flex gap-3 border border-cyan-400/20 bg-[#0D141E] p-5 text-sm"
          >
            {a.profiles?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.profiles.avatar_url}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full border border-white/15 object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-bold text-cyan-300">
                {(a.profiles?.full_name || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="truncate font-semibold text-white/90">
                  {a.profiles?.full_name ?? "—"}
                </span>
                <span
                  className={`${mono.className} shrink-0 text-[10px] uppercase tracking-wider text-white/30`}
                >
                  {timeAgo(a.created_at)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-white/70">{a.body}</p>
            </div>
          </li>
        ))}
        {!items?.length && (
          <li className="cut-corner border border-dashed border-white/10 bg-white/[0.015] px-6 py-10 text-center text-sm text-white/30">
            Todavía no hay avisos. {isStaff(profile) ? "Publica el primero arriba." : "Cuando el staff publique algo, aparece acá."}
          </li>
        )}
        </ul>
      </div>

      <TeamGallery editing={editing} initialUrls={team?.gallery_urls ?? []} />
      </div>
    </div>
  );
}
