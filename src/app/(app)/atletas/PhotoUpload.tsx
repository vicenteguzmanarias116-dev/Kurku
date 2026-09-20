"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PhotoUpload({
  initialUrl,
}: {
  initialUrl?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [dragging, setDragging] = useState(false);
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
      .from("athlete-photos")
      .upload(path, file, { upsert: true });

    if (error) {
      setStatus("error");
      return;
    }

    const { data } = supabase.storage.from("athlete-photos").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("done");
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-ink-2">Foto</span>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 py-4 transition ${
          dragging ? "border-brand bg-brand-soft" : "border-line-strong bg-sunken hover:border-brand/60"
        }`}
      >
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg border border-line object-cover"
          />
        )}
        <span className="text-sm text-ink-2">
          {status === "uploading" ? (
            "Subiendo…"
          ) : status === "done" || preview ? (
            "Listo · cambiar imagen"
          ) : (
            <>
              Arrastra una imagen aquí o{" "}
              <span className="text-brand-text underline">elige un archivo</span>
            </>
          )}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>
      {status === "error" && (
        <p className="mt-1 text-xs text-bad-text">
          No se pudo subir la imagen. Intenta de nuevo.
        </p>
      )}
      <input type="hidden" name="photo_url" value={url} />
    </div>
  );
}
