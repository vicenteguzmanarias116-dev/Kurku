"use client";

import { useActionState } from "react";
import { saveAthlete } from "./actions";
import PhotoUpload from "./PhotoUpload";
import { Card, Field, Input, Textarea, Button } from "../ui";

export default function AthleteFormClient({
  id,
  athlete,
}: {
  id: string;
  athlete: Record<string, unknown>;
}) {
  const [error, formAction] = useActionState(saveAthlete, null);

  return (
    <Card>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="id" value={id} />
        <ClientField name="full_name" label="Nombre completo" defaultValue={athlete.full_name} />
        <ClientField name="boat_class" label="Clase (ILCA 4 / 6 / 7)" defaultValue={athlete.boat_class} />
        <ClientField
          name="birthdate"
          label="Nacimiento"
          type="date"
          defaultValue={athlete.birthdate}
        />
        <ClientField name="weight_kg" label="Peso (kg)" type="number" defaultValue={athlete.weight_kg} />
        <PhotoUpload initialUrl={athlete.photo_url as string | null} />
        <Field label="Notas">
          <Textarea
            name="notes"
            defaultValue={athlete.notes == null ? "" : String(athlete.notes)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input type="checkbox" name="active" defaultChecked={athlete.active !== false} />
          Activo
        </label>

        {error && <p className="text-xs text-bad-text">{error}</p>}

        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </form>
    </Card>
  );
}

function ClientField({
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
    <Field label={label}>
      <Input
        name={name}
        type={type}
        defaultValue={defaultValue == null ? "" : String(defaultValue)}
      />
    </Field>
  );
}
