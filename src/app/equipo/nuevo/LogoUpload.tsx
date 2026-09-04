"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
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
      .from("team-logos")
      .upload(path, file, { upsert: true });

    if (error) {
      setStatus("error");
      return;
    }

    const { data } = supabase.storage.from("team-logos").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("done");
  }

  return (
    <div>
      <span className="mb-1 block text-xs uppercase tracking-wider text-white/50">
        Escudo / logo
      </span>
      <div className="flex items-center gap-4">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-16 w-16 border border-white/15 object-cover"
          />
        )}
        <label className="cut-corner cursor-pointer border border-white/15 bg-black/30 px-4 py-2 text-xs uppercase tracking-wider text-white/70 hover:border-cyan-300/60">
          {status === "uploading"
            ? "Subiendo…"
            : status === "done"
              ? "Cambiar imagen"
              : "Elegir imagen"}
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>
      {status === "error" && (
        <p className="mt-1 text-xs text-[#FF5A36]">
          No se pudo subir la imagen. Intenta de nuevo.
        </p>
      )}
      <input type="hidden" name="logo_url" value={url} />
    </div>
  );
}
