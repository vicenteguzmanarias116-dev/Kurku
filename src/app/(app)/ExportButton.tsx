import { mono } from "./fonts";

export default function ExportButton({ type, label }: { type: string; label?: string }) {
  return (
    <a
      href={`/api/export/${type}`}
      className={`${mono.className} border border-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/60 transition hover:border-cyan-300/60 hover:text-cyan-300`}
    >
      ⭳ {label ?? "Exportar CSV"}
    </a>
  );
}
