"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { mono } from "../fonts";
import { updateAccount } from "./actions";
import AvatarUpload from "./AvatarUpload";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

export default function ProfileForm({
  fullName,
  avatarUrl,
  bio,
}: {
  fullName: string;
  avatarUrl: string | null;
  bio: string;
}) {
  const [error, formAction] = useActionState(updateAccount, null);

  return (
    <form action={formAction} className="space-y-4">
      <AvatarUpload initialUrl={avatarUrl} />
      <label className="block text-sm">
        <span
          className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
        >
          Nombre completo
        </span>
        <input
          name="full_name"
          defaultValue={fullName}
          required
          className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
        />
      </label>
      <label className="block text-sm">
        <span
          className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
        >
          Sobre mí (opcional)
        </span>
        <textarea
          name="bio"
          rows={3}
          defaultValue={bio}
          placeholder="Un par de líneas sobre ti…"
          className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
        />
      </label>

      {error && (
        <p className={`${mono.className} text-xs text-[#FF5A36]`}>{error}</p>
      )}

      <Submit />
    </form>
  );
}
