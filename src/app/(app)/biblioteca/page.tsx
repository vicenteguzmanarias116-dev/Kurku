import Link from "next/link";
import { requireUser, isStaff } from "@/lib/auth";
import { mono, rajdhani } from "../fonts";
import PageHead from "../PageHead";
import UploadDoc from "./UploadDoc";
import { addFolder, deleteFolder, deleteDocument } from "./actions";

type Folder = { id: string; name: string };
type Doc = { id: string; title: string; file_url: string; folder_id: string | null; created_at: string };

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const staff = isStaff(profile);
  const sp = await searchParams;

  const [{ data: folders }, { data: docs }] = await Promise.all([
    supabase.from("library_folders").select("id, name").order("name"),
    supabase.from("library_documents").select("id, title, file_url, folder_id, created_at").order("created_at", { ascending: false }),
  ]);

  const allFolders = (folders as Folder[] | null) ?? [];
  const allDocs = (docs as Doc[] | null) ?? [];
  const activeFolder = sp.folder ? allFolders.find((f) => f.id === sp.folder) : null;
  const visibleDocs = allDocs.filter((d) =>
    activeFolder ? d.folder_id === activeFolder.id : sp.folder === undefined,
  );
  const rootDocs = allDocs.filter((d) => !d.folder_id);

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Recursos" title="Biblioteca" subtitle="Documentos y material informativo del equipo." />

      {staff && (
        <details className="space-y-4 rounded-xl border border-white/10 bg-[#0D141E]/80 p-5">
          <summary className={`${mono.className} cursor-pointer text-xs uppercase tracking-wider text-cyan-300`}>
            Administrar
          </summary>
          <form action={addFolder} className="mt-4 flex gap-2">
            <input
              name="name"
              placeholder="Nueva carpeta"
              required
              className="flex-1 border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
            />
            <button className="cut-corner bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/20">
              Crear carpeta
            </button>
          </form>
          <UploadDoc folders={allFolders} />
        </details>
      )}

      <div className="flex flex-wrap gap-2">
        <Link
          href="/biblioteca"
          className={`${mono.className} border px-3 py-1.5 text-xs uppercase tracking-wide ${
            !activeFolder ? "border-[#FF5A36] bg-[#FF5A36] text-[#05080D]" : "border-white/15 text-white/50 hover:text-white"
          }`}
        >
          Raíz ({rootDocs.length})
        </Link>
        {allFolders.map((f) => (
          <Link
            key={f.id}
            href={`/biblioteca?folder=${f.id}`}
            className={`${mono.className} border px-3 py-1.5 text-xs uppercase tracking-wide ${
              activeFolder?.id === f.id ? "border-[#FF5A36] bg-[#FF5A36] text-[#05080D]" : "border-white/15 text-white/50 hover:text-white"
            }`}
          >
            📁 {f.name} ({allDocs.filter((d) => d.folder_id === f.id).length})
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
        <div className="flex items-center justify-between">
          <h2 className={`${rajdhani.className} text-lg font-bold uppercase tracking-tight`}>
            {activeFolder ? activeFolder.name : "Raíz"}
          </h2>
          {staff && activeFolder && (
            <form action={deleteFolder}>
              <input type="hidden" name="id" value={activeFolder.id} />
              <button className="text-xs text-red-400 hover:underline">borrar carpeta</button>
            </form>
          )}
        </div>

        {!visibleDocs.length ? (
          <p className="mt-4 text-sm text-white/30">Sin documentos acá todavía.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {visibleDocs.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-2.5">
                <a
                  href={d.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-cyan-300 hover:underline"
                >
                  📄 {d.title}
                </a>
                {staff && (
                  <form action={deleteDocument}>
                    <input type="hidden" name="id" value={d.id} />
                    <button className="text-xs text-red-400 hover:underline">borrar</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
