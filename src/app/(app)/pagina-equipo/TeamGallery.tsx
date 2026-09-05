"use client";

import { useState } from "react";
import { mono } from "../fonts";
import { createClient } from "@/lib/supabase/client";
import { setGallery } from "./gallery-actions";

export default function TeamGallery({
  isAdmin,
  initialUrls,
}: {
  isAdmin: boolean;
  initialUrls: string[];
}) {
  const [urls, setUrls] = useState(initialUrls);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      return;
    }
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("team-gallery").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("team-gallery").getPublicUrl(path);
      const next = [...urls, data.publicUrl];
      setUrls(next);
      await setGallery(next);
    }
    setUploading(false);
  }

  async function remove(url: string) {
    const next = urls.filter((u) => u !== url);
    setUrls(next);
    await setGallery(next);
  }

  return (
    <div className="hud-frame cut-corner relative border border-cyan-400/20 bg-[#0D141E] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`${mono.className} block text-[10px] uppercase tracking-widest text-white/40`}
        >
          Fotos del equipo
        </span>
        {isAdmin && (
          <button
            onClick={() => setEditing((v) => !v)}
            aria-label="Personalizar página"
            title="Personalizar página"
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
              editing
                ? "border-cyan-300 bg-cyan-300/10 text-cyan-300"
                : "border-white/15 text-white/40 hover:border-cyan-300/60 hover:text-cyan-300"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.51.12.99.44 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </button>
        )}
      </div>

      {editing && (
        <p className="mb-3 text-xs text-cyan-300/80">
          Modo personalización: agrega o quita fotos.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {urls.map((u) => (
          <div key={u} className="group relative aspect-square overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            {editing && (
              <button
                onClick={() => remove(u)}
                aria-label="Quitar foto"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white/80 transition hover:bg-[#FF5A36] hover:text-[#05080D]"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {editing && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-white/15 text-center text-xs text-white/50 transition hover:border-cyan-300/60 hover:text-cyan-300">
            {uploading ? (
              "Subiendo…"
            ) : (
              <>
                <span className="text-xl leading-none">+</span>
                Agregar foto
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
          </label>
        )}
      </div>

      {!urls.length && !editing && (
        <p className="text-sm text-white/30">
          Todavía no hay fotos.
          {isAdmin && " Usa la tuerca para agregar."}
        </p>
      )}
    </div>
  );
}
