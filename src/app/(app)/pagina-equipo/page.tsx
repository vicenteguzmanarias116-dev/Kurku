import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani, mono } from "../fonts";

type Ann = {
  id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
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

export default async function PaginaEquipoPage() {
  const { supabase, profile } = await requireUser();
  const { data: items } = await supabase
    .from("announcements")
    .select("id, body, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}>
          Página del equipo
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Avisos de regata, entrenamiento físico, nutrición o del club — lo
          último que publicó el staff.
        </p>
      </div>

      {isStaff(profile) && (
        <form
          action={post}
          className="cut-corner space-y-3 border border-cyan-400/20 bg-[#0D141E] p-5"
        >
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Anuncio para el equipo…"
            className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
          />
          <button className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
            Publicar
          </button>
        </form>
      )}

      <ul className="cut-corner space-y-4 border border-cyan-400/20 bg-[#0D141E] p-6">
        {(items as Ann[] | null)?.map((a) => (
          <li key={a.id} className="border-t border-white/10 pt-4 text-sm first:border-0 first:pt-0">
            <p className="whitespace-pre-wrap">{a.body}</p>
            <p className={`${mono.className} mt-2 text-[10px] uppercase tracking-wider text-white/30`}>
              {a.profiles?.full_name ?? "—"} ·{" "}
              {new Date(a.created_at).toLocaleString("es-ES", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </li>
        ))}
        {!items?.length && <li className="text-sm text-white/30">Sin anuncios.</li>}
      </ul>
    </div>
  );
}
