"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { postAnnouncement } from "./post-actions";
import { Card, Textarea, Button } from "../ui";

type Attachment = { name: string; url: string };

function Submit({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" disabled={pending || uploading}>
      {pending ? "Publicando…" : uploading ? "Subiendo…" : "Publicar"}
    </Button>
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
    <Card className="relative">
      <form action={formAction} className="space-y-3">
        <span className="block text-xs font-medium text-ink-2">Nuevo aviso</span>
        <Textarea
          name="body"
          rows={3}
          placeholder="Aviso para el equipo…"
          className="resize-none"
        />

        {attachments.map((a) => (
          <div key={a.url}>
            <input type="hidden" name="attachment" value={a.url} />
            <div className="flex items-center gap-2 rounded-lg border border-line bg-sunken px-2.5 py-1.5 text-xs text-ink-2">
              <span className="truncate">{a.name}</span>
              <button
                type="button"
                onClick={() =>
                  setAttachments((prev) => prev.filter((x) => x.url !== a.url))
                }
                className="ml-auto shrink-0 text-ink-3 hover:text-brand-text"
                aria-label="Quitar adjunto"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-ink-2 transition hover:text-brand-text">
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

        {error && <p className="text-xs text-bad-text">{error}</p>}
      </form>
    </Card>
  );
}
