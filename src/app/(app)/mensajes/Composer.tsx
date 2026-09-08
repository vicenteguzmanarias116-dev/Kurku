"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessage, markThreadRead } from "./actions";
import { mono } from "../fonts";

export default function Composer({ recipientId }: { recipientId: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const marked = useRef<string | null>(null);

  useEffect(() => {
    if (marked.current === recipientId) return;
    marked.current = recipientId;
    markThreadRead(recipientId);
  }, [recipientId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = body;
    if (!text.trim()) return;
    setBody("");
    startTransition(() => sendMessage(recipientId, text));
  }

  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Escribe un mensaje…"
        className="flex-1 border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
      />
      <button
        type="submit"
        disabled={pending}
        className={`${mono.className} cut-corner bg-[#FF5A36] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-50`}
      >
        Enviar
      </button>
    </form>
  );
}
