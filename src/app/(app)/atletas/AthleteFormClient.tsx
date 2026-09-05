"use client";

import { useActionState } from "react";
import { mono } from "../fonts";
import { saveAthlete } from "./actions";
import PhotoUpload from "./PhotoUpload";

export default function AthleteFormClient({
  id,
  athlete,
}: {
  id: string;
  athlete: Record<string, unknown>;
}) {
  const [error, formAction] = useActionState(saveAthlete, null);

  return (
    <form
      action={formAction}
      className="cut-corner space-y-3 border border-cyan-400/20 bg-[#0D141E] p-6"
    >
      <input type="hidden" name="id" value={id} />
      <Field name="full_name" label="Nombre completo" defaultValue={athlete.full_name} />
      <Field name="boat_class" label="Clase (ILCA 4 / 6 / 7)" defaultValue={athlete.boat_class} />
      <Field
        name="birthdate"
        label="Nacimiento"
        type="date"
        defaultValue={athlete.birthdate}
      />
      <Field name="weight_kg" label="Peso (kg)" type="number" defaultValue={athlete.weight_kg} />
      <PhotoUpload initialUrl={athlete.photo_url as string | null} />
      <label className="block text-sm">
        <span
          className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
        >
          Notas
        </span>
        <textarea
          name="notes"
          defaultValue={athlete.notes == null ? "" : String(athlete.notes)}
          className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
        />
      </label>
      <label
        className={`${mono.className} flex items-center gap-2 text-xs uppercase tracking-wider text-white/50`}
      >
        <input type="checkbox" name="active" defaultChecked={athlete.active !== false} />
        Activo
      </label>

      {error && (
        <p className={`${mono.className} text-xs text-[#FF5A36]`}>{error}</p>
      )}

      <button className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
        Guardar
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: unknown;
}) {
  return (
    <label className="block text-sm">
      <span
        className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
      >
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
}
