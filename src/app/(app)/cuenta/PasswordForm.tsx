"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui";

export default function PasswordForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setStatus("sending");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/reset`,
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-xs text-ok-text">
        Te enviamos un link a {email} para elegir una contraseña nueva.
      </p>
    );
  }

  return (
    <div>
      {error && <p className="mb-2 text-xs text-bad-text">{error}</p>}
      <Button onClick={send} disabled={status === "sending"} variant="secondary">
        {status === "sending" ? "Enviando…" : "Cambiar contraseña"}
      </Button>
    </div>
  );
}
