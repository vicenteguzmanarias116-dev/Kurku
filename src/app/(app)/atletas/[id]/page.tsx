import { notFound, redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import { saveAthlete, deleteAthlete } from "../actions";
import { rajdhani, mono } from "../../fonts";

export default async function AthleteForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) redirect("/atletas");

  const isNew = id === "nuevo";
  let a: Record<string, unknown> = { active: true };
  if (!isNew) {
    const { data } = await supabase.from("athletes").select("*").eq("id", id).single();
    if (!data) notFound();
    a = data;
  }

  const F = ({
    name,
    label,
    type = "text",
    defaultValue,
  }: {
    name: string;
    label: string;
    type?: string;
    defaultValue?: unknown;
  }) => (
    <label className="block text-sm">
      <span className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}>
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue == null ? "" : String(defaultValue)}
        className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
      />
    </label>
  );

  return (
    <div className="max-w-md space-y-4">
      <h2 className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}>
        {isNew ? "Nuevo atleta" : "Editar atleta"}
      </h2>
      <form action={saveAthlete} className="cut-corner space-y-3 border border-cyan-400/20 bg-[#0D141E] p-6">
        <input type="hidden" name="id" value={id} />
        <F name="full_name" label="Nombre completo" defaultValue={a.full_name} />
        <F name="boat_class" label="Clase (ILCA 4 / 6 / 7)" defaultValue={a.boat_class} />
        <F name="birthdate" label="Nacimiento" type="date" defaultValue={a.birthdate} />
        <F name="weight_kg" label="Peso (kg)" type="number" defaultValue={a.weight_kg} />
        <F name="photo_url" label="Foto (URL)" defaultValue={a.photo_url} />
        <label className="block text-sm">
          <span className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}>
            Notas
          </span>
          <textarea
            name="notes"
            defaultValue={a.notes == null ? "" : String(a.notes)}
            className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
          />
        </label>
        <label className={`${mono.className} flex items-center gap-2 text-xs uppercase tracking-wider text-white/50`}>
          <input type="checkbox" name="active" defaultChecked={a.active !== false} />
          Activo
        </label>
        <button className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
          Guardar
        </button>
      </form>

      {!isNew && (
        <form action={deleteAthlete}>
          <input type="hidden" name="id" value={id} />
          <button className="text-sm text-red-400 hover:underline">
            Eliminar atleta
          </button>
        </form>
      )}
    </div>
  );
}
