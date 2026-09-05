"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { setGallery } from "./gallery-actions";

// bento: la primera foto ocupa 2x2, el resto va en celdas simples
const SPAN: Record<number, string> = {
  0: "col-span-2 row-span-2",
};

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
    <div>
      <div className="grid grid-cols-2 auto-rows-[110px] gap-2.5">
        {urls.map((u, i) => (
          <div
            key={u}
            className={`group relative overflow-hidden rounded-2xl shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-[1.02] ${
              SPAN[i] ?? ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            {editing && (
              <button
                onClick={() => remove(u)}
                aria-label="Quitar foto"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/80 opacity-0 backdrop-blur transition hover:bg-[#FF5A36] hover:text-[#05080D] group-hover:opacity-100"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {editing && (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center text-xs text-white/40 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.04] hover:text-cyan-300 ${
              urls.length === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
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
    </div>
  );
}
