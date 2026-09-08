"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { mono } from "../fonts";
import { saveIntervalsCredentials, syncIntervals } from "./intervals-actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="cut-corner bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/20 disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar credenciales"}
    </button>
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
        <label className="block text-sm">
          <span className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}>
            Athlete ID (ej. i123456)
          </span>
          <input
            name="intervals_athlete_id"
            defaultValue={athleteId}
            placeholder="i123456"
            className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
          />
        </label>
        <label className="block text-sm">
          <span className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}>
            API Key
          </span>
          <input
            name="intervals_api_key"
            type="password"
            defaultValue={apiKey}
            className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
          />
        </label>
        {error && <p className={`${mono.className} text-xs text-[#FF5A36] sm:col-span-2`}>{error}</p>}
        <div className="sm:col-span-2">
          <Submit />
        </div>
      </form>

      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
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
          className="cut-corner bg-[#FF5A36] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-60"
        >
          {syncing ? "Sincronizando…" : "Sincronizar ahora"}
        </button>
        <span className={`${mono.className} text-[10px] uppercase tracking-wider text-white/30`}>
          {lastSyncedAt
            ? `Última vez: ${new Date(lastSyncedAt).toLocaleString("es-PE")}`
            : "Todavía no sincronizaste."}
        </span>
      </div>
      {syncMsg && <p className="text-xs text-cyan-300">{syncMsg}</p>}
    </div>
  );
}
