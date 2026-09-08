"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addDocument } from "./actions";

export default function UploadDoc({ folders }: { folders: { id: string; name: string }[] }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(formData: FormData) {
    const file = fileRef.current?.files?.[0];
    const title = String(formData.get("title") || "").trim();
    const folderId = String(formData.get("folder_id") || "") || null;
    if (!file || !title) return;

    setStatus("uploading");
    const supabase = createClient();
    const path = `${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("library-docs").upload(path, file);
    if (upErr) {
      setStatus("error");
      return;
    }
    const { data } = supabase.storage.from("library-docs").getPublicUrl(path);
    await addDocument({ title, file_url: data.publicUrl, folder_id: folderId });
    setStatus("idle");
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={submit}
      className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"
    >
      <input
        name="title"
        placeholder="Título del documento"
        required
        className="border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
      />
      <select
        name="folder_id"
        className="border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
      >
        <option value="">Sin carpeta (raíz)</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <input
        ref={fileRef}
        type="file"
        required
        className="col-span-2 text-xs text-white/60 file:mr-3 file:border file:border-white/15 file:bg-black/30 file:px-3 file:py-1.5 file:text-white sm:col-span-1"
      />
      <button
        type="submit"
        disabled={status === "uploading"}
        className="cut-corner bg-[#FF5A36] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-50"
      >
        {status === "uploading" ? "Subiendo…" : "Subir"}
      </button>
      {status === "error" && (
        <p className="col-span-2 text-xs text-[#FF5A36] sm:col-span-4">
          No se pudo subir. Intenta de nuevo.
        </p>
      )}
    </form>
  );
}
