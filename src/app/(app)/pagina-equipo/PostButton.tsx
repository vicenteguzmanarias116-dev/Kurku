"use client";

import { useFormStatus } from "react-dom";

export default function PostButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-60"
    >
      {pending ? "Publicando…" : "Publicar"}
    </button>
  );
}
