"use client";

import { useState } from "react";

export default function InviteLink({ teamId }: { teamId: string }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/unirse/${teamId}`
      : "";

  return (
    <div className="cut-corner flex flex-wrap items-center gap-3 border border-cyan-400/20 bg-[#0D141E] px-4 py-3 text-sm">
      <span className="text-white/60">Invita atletas con este link:</span>
      <code className="flex-1 truncate text-xs text-cyan-300">{link}</code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="cut-corner bg-[#FF5A36] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
