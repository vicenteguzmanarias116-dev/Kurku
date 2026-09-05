"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { mono } from "../fonts";
import { createClient } from "@/lib/supabase/client";
import { postAnnouncement } from "./post-actions";

type Attachment = { name: string; url: string };

function Submit({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending || uploading}
      className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-60"
    >
      {pending ? "Publicando…" : uploading ? "Subiendo…" : "Publicar"}
    </button>
  );
}

export default function AnnouncementForm() {
  const [error, formAction] = useActionState(postAnnouncement, null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      return;
    }
    const added: Attachment[] = [];
    for (const file of Array.from(files)) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("announcement-files")
        .upload(path, file);
      if (!error) {
        const { data } = supabase.storage
          .from("announcement-files")
          .getPublicUrl(path);
        added.push({ name: file.name, url: data.publicUrl });
      }
    }
    setAttachments((prev) => [...prev, ...added]);
    setUploading(false);
  }

  return (
    <form
      action={formAction}
      className="relative space-y-3 rounded-xl border border-white/10 bg-[#0D141E]/80 p-5"
    >
      <span
        className={`${mono.className} block text-[10px] uppercase tracking-widest text-white/40`}
      >
        Nuevo aviso
      </span>
      <textarea
        name="body"
        rows={3}
        placeholder="Aviso para el equipo…"
        className="w-full resize-none border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
      />

      {attachments.map((a) => (
        <div key={a.url}>
          <input type="hidden" name="attachment" value={a.url} />
          <div className="flex items-center gap-2 border border-white/10 bg-black/20 px-2.5 py-1.5 text-xs text-white/70">
            <span className="truncate">{a.name}</span>
            <button
              type="button"
              onClick={() =>
                setAttachments((prev) => prev.filter((x) => x.url !== a.url))
              }
              className="ml-auto shrink-0 text-white/40 hover:text-[#FF5A36]"
              aria-label="Quitar adjunto"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <label
          className={`${mono.className} inline-flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50 transition hover:text-cyan-300`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          Adjuntar archivo
          <input
            type="file"
            multiple
            onChange={(e) => addFiles(e.target.files)}
            className="hidden"
          />
        </label>
        <Submit uploading={uploading} />
      </div>

      {error && (
        <p className={`${mono.className} text-xs text-[#FF5A36]`}>{error}</p>
      )}
    </form>
  );
}
