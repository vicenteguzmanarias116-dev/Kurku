"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { saveIntervalsCredentials, syncIntervals } from "./intervals-actions";
import { Field, Input, Button } from "../ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button variant="secondary" size="sm" disabled={pending}>
      {pending ? "Guardando…" : "Guardar credenciales"}
    </Button>
  );
}

export default function IntervalsForm({
  athleteId,
  apiKey,
  lastSyncedAt,
}: {
  athleteId: string;
  apiKey: string;
  lastSyncedAt: string | null;
}) {
  const [error, formAction] = useActionState(saveIntervalsCredentials, null);
  const [syncing, startSync] = useTransition();
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Athlete ID (ej. i123456)">
          <Input name="intervals_athlete_id" defaultValue={athleteId} placeholder="i123456" />
        </Field>
        <Field label="API Key">
          <Input name="intervals_api_key" type="password" defaultValue={apiKey} />
        </Field>
        {error && <p className="text-xs text-bad-text sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <Submit />
        </div>
      </form>

      <div className="flex items-center gap-3 border-t border-line pt-4">
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={syncing}
          onClick={() =>
            startSync(async () => {
              const res = await syncIntervals();
              setSyncMsg(
                "error" in res && res.error
                  ? res.error
                  : `${res.imported ?? 0} entrenamiento(s) importado(s).`,
              );
            })
          }
        >
          {syncing ? "Sincronizando…" : "Sincronizar ahora"}
        </Button>
        <span className="text-xs text-ink-3">
          {lastSyncedAt
            ? `Última vez: ${new Date(lastSyncedAt).toLocaleString("es-PE")}`
            : "Todavía no sincronizaste."}
        </span>
      </div>
      {syncMsg && <p className="text-xs text-ok-text">{syncMsg}</p>}
    </div>
  );
}
