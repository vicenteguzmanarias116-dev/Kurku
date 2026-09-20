"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessage, markThreadRead } from "./actions";
import { Input, Button } from "../ui";

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
    <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
      <Input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Escribe un mensaje…"
        className="flex-1"
      />
      <Button type="submit" variant="primary" disabled={pending}>
        Enviar
      </Button>
    </form>
  );
}
