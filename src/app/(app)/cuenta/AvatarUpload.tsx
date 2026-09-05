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
          className="h-16 w-16 shrink-0 rounded-full border border-white/15 object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#FF5A36]/40 bg-[#FF5A36]/10 text-xl font-bold text-[#FF5A36]">
          ?
        </span>
      )}
      <label className="cut-corner cursor-pointer border border-white/15 bg-black/30 px-3 py-2 text-xs uppercase tracking-wider text-white/70 transition hover:border-cyan-300/60">
        {status === "uploading" ? "Subiendo…" : "Cambiar foto"}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>
      {status === "error" && (
        <p className="text-xs text-[#FF5A36]">No se pudo subir.</p>
      )}
      <input type="hidden" name="avatar_url" value={url} />
    </div>
  );
}
