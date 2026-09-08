// Herramientas que el admin puede prender/apagar en el nav del equipo.
// Las que no están acá (Página del equipo, Panel, Miembros) van siempre.
export const OPTIONAL_MODULES = [
  { key: "atletas", href: "/atletas", label: "Atletas" },
  { key: "entrenamientos", href: "/entrenamientos", label: "Entrenamientos" },
  { key: "calendario", href: "/calendario", label: "Calendario" },
  { key: "salud", href: "/salud", label: "Salud" },
  { key: "lesiones", href: "/lesiones", label: "Lesiones" },
  { key: "biblioteca", href: "/biblioteca", label: "Biblioteca" },
  { key: "mensajes", href: "/mensajes", label: "Mensajes" },
  { key: "noticias", href: "/noticias", label: "Noticias" },
] as const;
