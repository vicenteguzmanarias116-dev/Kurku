import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

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
  revalidatePath("/comunicacion");
}

export default async function ComunicacionPage() {
  const { supabase, profile } = await requireUser();
  const { data: items } = await supabase
    .from("announcements")
    .select("id, body, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold">Comunicación</h2>

      {isStaff(profile) && (
        <form action={post} className="space-y-2">
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Anuncio para el equipo…"
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
          <button className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">
            Publicar
          </button>
        </form>
      )}

      <ul className="space-y-4">
        {(items as Ann[] | null)?.map((a) => (
          <li key={a.id} className="border-t border-zinc-100 pt-3 text-sm">
            <p className="whitespace-pre-wrap">{a.body}</p>
            <p className="mt-1 text-xs text-zinc-400">
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
        {!items?.length && <li className="text-zinc-400 text-sm">Sin anuncios.</li>}
      </ul>
    </div>
  );
}
