export default function ExportButton({ type, label }: { type: string; label?: string }) {
  return (
    <a
      href={`/api/export/${type}`}
      className="rounded-lg border border-line-strong px-3 py-2 text-xs font-semibold text-ink-2 transition hover:border-brand/60 hover:text-brand-text"
    >
      ⭳ {label ?? "Exportar CSV"}
    </a>
  );
}
