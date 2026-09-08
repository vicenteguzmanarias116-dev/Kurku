const PATHS: Record<string, React.ReactNode> = {
  "pagina-equipo": <path d="M4 3v18M4 4l14 3-14 3" />,
  dashboard: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-3.5 3.5L9 15l3.5-3.5z" fill="currentColor" stroke="none" />
    </>
  ),
  atletas: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M15.5 20c.3-2.4 2-4.3 4.3-4.8" />
    </>
  ),
  entrenamientos: <path d="M22 12h-4l-3 9-6-18-3 9H2" />,
  calendario: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  salud: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  lesiones: (
    <>
      <path d="M8.5 15.5 4 20M15.5 8.5 20 4" />
      <rect x="7.5" y="7.5" width="9" height="9" rx="2" transform="rotate(45 12 12)" />
      <path d="M10.5 13.5v-3M9 12h3" />
    </>
  ),
  mensajes: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  noticias: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M7 8h6M7 12h10M7 16h10" />
    </>
  ),
  miembros: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5M12 20c0-3 2.7-5.5 6-5.5s4 2.5 4 5.5" />
    </>
  ),
};

export default function NavIcon({ name, className }: { name: string; className?: string }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {path}
    </svg>
  );
}
