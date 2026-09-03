import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

type Event = {
  id: string;
  kind: string;
  title: string;
  starts_at: string;
  location: string | null;
  description: string | null;
};

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
      <h2 className="text-lg font-semibold">Calendario</h2>

      {staff && (
        <form action={addEvent} className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <input name="title" placeholder="Título" required className="rounded border border-zinc-300 px-2 py-1.5" />
          <input name="starts_at" type="datetime-local" required className="rounded border border-zinc-300 px-2 py-1.5" />
          <select name="kind" className="rounded border border-zinc-300 px-2 py-1.5">
            <option value="training">Entrenamiento</option>
            <option value="regatta">Regata</option>
            <option value="other">Otro</option>
          </select>
          <input name="location" placeholder="Lugar" className="rounded border border-zinc-300 px-2 py-1.5" />
          <input name="description" placeholder="Notas" className="rounded border border-zinc-300 px-2 py-1.5" />
          <button className="rounded bg-zinc-900 px-3 py-1.5 text-white">Añadir</button>
        </form>
      )}

      <ul className="space-y-2 text-sm">
        {(events as Event[] | null)?.map((e) => (
          <li key={e.id} className="flex items-start gap-3 border-t border-zinc-100 pt-2">
            <span className="w-28 shrink-0 text-zinc-500">
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
                <span className="ml-2 rounded bg-blue-100 px-1.5 text-xs text-blue-700">regata</span>
              )}
              {e.location && <span className="text-zinc-400"> · {e.location}</span>}
              {e.description && <div className="text-zinc-500">{e.description}</div>}
            </span>
            {staff && (
              <form action={delEvent}>
                <input type="hidden" name="id" value={e.id} />
                <button className="text-xs text-red-600">borrar</button>
              </form>
            )}
          </li>
        ))}
        {!events?.length && <li className="text-zinc-400">Nada programado.</li>}
      </ul>
    </div>
  );
}
