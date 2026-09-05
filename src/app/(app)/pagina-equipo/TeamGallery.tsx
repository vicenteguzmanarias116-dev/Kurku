"use client";

import { useState } from "react";
import { mono } from "../fonts";
import { createClient } from "@/lib/supabase/client";
import { setGallery } from "./gallery-actions";

export default function TeamGallery({
  editing,
  initialUrls,
}: {
  editing: boolean;
  initialUrls: string[];
}) {
  const [urls, setUrls] = useState(initialUrls);
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
      <span
        className={`${mono.className} mb-4 block text-[10px] uppercase tracking-widest text-white/40`}
      >
        Fotos del equipo
      </span>

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
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-cyan-300/40 bg-cyan-300/[0.03] text-center text-xs text-cyan-300/80 transition hover:border-cyan-300/70 hover:text-cyan-300">
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
        <p className="text-sm text-white/30">Todavía no hay fotos.</p>
      )}
    </div>
  );
}
