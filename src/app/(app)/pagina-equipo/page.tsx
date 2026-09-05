import Link from "next/link";
import { requireUser, isStaff, isAdmin } from "@/lib/auth";
import { mono } from "../fonts";
import PageHead from "../PageHead";
import TeamGallery from "./TeamGallery";
import ModuleToggles from "./ModuleToggles";
import AnnouncementForm from "./AnnouncementForm";

type Ann = {
  id: string;
  body: string;
  created_at: string;
  attachment_urls: string[] | null;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
};

const IMG_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|$)/i;

function fileName(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() || "archivo").replace(
      /^\d+-/,
      "",
    );
  } catch {
    return "archivo";
  }
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
      .select("id, body, created_at, attachment_urls, profiles(full_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("teams")
      .select("gallery_urls, hidden_modules")
      .eq("id", profile!.team_id)
      .single<{ gallery_urls: string[]; hidden_modules: string[] }>(),
  ]);
  const galleryUrls = team?.gallery_urls ?? [];
  const showGallery = editing || galleryUrls.length > 0;

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
      <div
        className={`grid gap-6 ${
          showGallery || editing ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]" : ""
        }`}
      >
      <div className="max-w-2xl space-y-6">
        <PageHead
          eyebrow="Flota · ILCA"
          title="Página del equipo"
          subtitle="Avisos de regata, entrenamiento físico, nutrición o del club — lo último que publicó el staff."
        />

        {isStaff(profile) && <AnnouncementForm />}

      <ul className="space-y-3">
        {(items as Ann[] | null)?.map((a) => (
          <li
            key={a.id}
            className="relative flex gap-3 rounded-xl border border-white/10 bg-[#0D141E]/80 p-5 text-sm transition hover:border-white/20"
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
              {a.body && (
                <p className="mt-1 whitespace-pre-wrap text-white/70">{a.body}</p>
              )}
              {!!a.attachment_urls?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.attachment_urls.map((url) =>
                    IMG_EXT.test(url) ? (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-28 w-28 rounded-lg border border-white/10 object-cover transition hover:opacity-90"
                        />
                      </a>
                    ) : (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${mono.className} flex items-center gap-1.5 border border-white/15 bg-black/20 px-2.5 py-1.5 text-[11px] text-cyan-300 transition hover:border-cyan-300/60`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                          <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        {fileName(url)}
                      </a>
                    ),
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
        {!items?.length && (
          <li className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-10 text-center text-sm text-white/30">
            Todavía no hay avisos. {isStaff(profile) ? "Publica el primero arriba." : "Cuando el staff publique algo, aparece acá."}
          </li>
        )}
        </ul>
      </div>

      {(showGallery || editing) && (
        <div className="space-y-6">
          {editing && (
            <ModuleToggles initialHidden={team?.hidden_modules ?? []} />
          )}
          {showGallery && (
            <TeamGallery editing={editing} initialUrls={galleryUrls} />
          )}
        </div>
      )}
      </div>
    </div>
  );
}
