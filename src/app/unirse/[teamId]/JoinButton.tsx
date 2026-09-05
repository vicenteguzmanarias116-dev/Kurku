"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinTeam } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cut-corner w-full bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-60"
    >
      {pending ? "Uniendo…" : "Unirme al equipo"}
    </button>
  );
}

export default function JoinButton({ teamId }: { teamId: string }) {
  const [error, formAction] = useActionState(joinTeam, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="team_id" value={teamId} />
      <p className="mb-4 text-sm text-white/60">
        Vas a entrar como atleta. Después completas tus datos.
      </p>
      {error && (
        <p className="mb-3 text-xs text-[#FF5A36]">{error}</p>
      )}
      <Submit />
    </form>
  );
}
