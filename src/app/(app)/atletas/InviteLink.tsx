"use client";

import { useState } from "react";

export default function InviteLink({ teamId }: { teamId: string }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/unirse/${teamId}`
      : "";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
      <span className="text-ink-2">Invita atletas con este link:</span>
      <code className="flex-1 truncate text-xs text-brand-text">{link}</code>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded-lg bg-brand-strong px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
