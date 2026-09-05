import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";
import { mono } from "../fonts";
import PageHead from "../PageHead";

type Event = {
  id: string;
  kind: string;
  title: string;
  starts_at: string;
  location: string | null;
  description: string | null;
};

const input =
  "border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40";

async function addEvent(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  const row = {
    team_id: profile!.team_id,
    kind: String(formData.get("kind") || "training"),
    title: String(formData.get("title") || "").trim(),
    starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
    location: String(formData.get("location") || "") || null,
    description: String(formData.get("description") || "") || null,
  };
  if (!row.title || !formData.get("starts_at")) throw new Error("Falta título o fecha.");
  const { error } = await supabase.from("events").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/calendario");
}

async function delEvent(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  await supabase.from("events").delete().eq("id", String(formData.get("id")));
  revalidatePath("/calendario");
}

export default async function CalendarioPage() {
  const { supabase, profile } = await requireUser();
  const staff = isStaff(profile);
  const { data: events } = await supabase
    .from("events")
    .select("id, kind, title, starts_at, location, description")
    .order("starts_at");

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Regatas · Entrenos" title="Calendario" />

      {staff && (
        <form
          action={addEvent}
          className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-[#0D141E]/80 p-5 text-sm sm:grid-cols-3"
        >
          <input name="title" placeholder="Título" required className={input} />
          <input name="starts_at" type="datetime-local" required className={input} />
          <select name="kind" className={input}>
            <option value="training">Entrenamiento</option>
            <option value="regatta">Regata</option>
            <option value="other">Otro</option>
          </select>
          <input name="location" placeholder="Lugar" className={input} />
          <input name="description" placeholder="Notas" className={input} />
          <button className="cut-corner bg-[#FF5A36] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
            Añadir
          </button>
        </form>
      )}

      <ul className="space-y-3 rounded-xl border border-white/10 bg-[#0D141E]/80 p-6 text-sm">
        {(events as Event[] | null)?.map((e) => (
          <li
            key={e.id}
            className="flex items-start gap-3 border-t border-white/10 pt-3 first:border-0 first:pt-0"
          >
            <span
              className={`${mono.className} w-24 shrink-0 text-xs uppercase tracking-wider text-cyan-300`}
            >
              {new Date(e.starts_at).toLocaleString("es-ES", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex-1">
              <strong>{e.title}</strong>
              {e.kind === "regatta" && (
                <span
                  className={`${mono.className} ml-2 border border-[#FF5A36]/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[#FF5A36]`}
                >
                  regata
                </span>
              )}
              {e.location && <span className="text-white/40"> · {e.location}</span>}
              {e.description && <div className="text-white/40">{e.description}</div>}
            </span>
            {staff && (
              <form action={delEvent}>
                <input type="hidden" name="id" value={e.id} />
                <button className="text-xs text-red-400 hover:underline">borrar</button>
              </form>
            )}
          </li>
        ))}
        {!events?.length && <li className="text-white/30">Nada programado.</li>}
      </ul>
    </div>
  );
}
