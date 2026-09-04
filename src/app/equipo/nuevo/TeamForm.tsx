"use client";

import { useActionState } from "react";
import { mono } from "../../fonts";
import { createTeam } from "./actions";
import LogoUpload from "./LogoUpload";
import SubmitButton from "./SubmitButton";

export default function TeamForm() {
  const [error, formAction] = useActionState(createTeam, null);

  return (
    <form action={formAction} className="space-y-4">
      <Field name="name" label="Nombre del equipo" required />
      <Field name="location" label="Ubicación" placeholder="Lima, Perú" />
      <LogoUpload />
      <label className="block text-sm">
        <span
          className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
        >
          Descripción
        </span>
        <textarea
          name="description"
          rows={3}
          placeholder="A qué se dedica el equipo, categorías, historia…"
          className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
        />
      </label>

      {error && (
        <p className={`${mono.className} text-xs text-[#FF5A36]`}>{error}</p>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
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
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
      />
    </label>
  );
}
