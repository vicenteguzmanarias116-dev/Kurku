import { notFound, redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import { saveAthlete, deleteAthlete } from "../actions";

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
      <span className="text-zinc-600">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue == null ? "" : String(defaultValue)}
        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
      />
    </label>
  );

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">
        {isNew ? "Nuevo atleta" : "Editar atleta"}
      </h2>
      <form action={saveAthlete} className="space-y-3">
        <input type="hidden" name="id" value={id} />
        <F name="full_name" label="Nombre completo" defaultValue={a.full_name} />
        <F name="boat_class" label="Clase (ILCA 4 / 6 / 7)" defaultValue={a.boat_class} />
        <F name="birthdate" label="Nacimiento" type="date" defaultValue={a.birthdate} />
        <F name="weight_kg" label="Peso (kg)" type="number" defaultValue={a.weight_kg} />
        <F name="photo_url" label="Foto (URL)" defaultValue={a.photo_url} />
        <label className="block text-sm">
          <span className="text-zinc-600">Notas</span>
          <textarea
            name="notes"
            defaultValue={a.notes == null ? "" : String(a.notes)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={a.active !== false} />
          Activo
        </label>
        <button className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">
          Guardar
        </button>
      </form>

      {!isNew && (
        <form action={deleteAthlete}>
          <input type="hidden" name="id" value={id} />
          <button className="text-sm text-red-600 hover:underline">
            Eliminar atleta
          </button>
        </form>
      )}
    </div>
  );
}
