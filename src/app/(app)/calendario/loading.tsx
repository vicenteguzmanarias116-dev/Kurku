export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando calendario">
      <div className="h-14 w-64 animate-pulse rounded-lg bg-sunken" />
      <div className="h-8 w-48 animate-pulse rounded-lg bg-sunken" />
      <div className="rounded-xl border border-line bg-surface p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-px bg-line">
          {Array.from({ length: 42 }, (_, i) => (
            <div key={i} className="min-h-[90px] bg-surface p-1.5 sm:min-h-[110px]">
              <div className="h-3 w-4 animate-pulse rounded bg-sunken" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
