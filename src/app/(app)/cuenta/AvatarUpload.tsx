"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AvatarUpload({
  initialUrl,
}: {
  initialUrl?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus("uploading");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setStatus("error");
      return;
    }

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (error) {
      setStatus("error");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("done");
  }

  return (
    <div className="flex items-center gap-4">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xl font-bold text-brand-text">
          ?
        </span>
      )}
      <label className="cursor-pointer rounded-lg border border-line-strong bg-sunken px-3 py-2 text-sm text-ink-2 transition hover:border-brand/60">
        {status === "uploading" ? "Subiendo…" : "Cambiar foto"}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>
      {status === "error" && (
        <p className="text-xs text-bad-text">No se pudo subir.</p>
      )}
      <input type="hidden" name="avatar_url" value={url} />
    </div>
  );
}
