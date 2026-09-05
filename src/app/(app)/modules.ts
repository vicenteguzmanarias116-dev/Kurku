// Herramientas que el admin puede prender/apagar en el nav del equipo.
// Las que no están acá (Página del equipo, Panel, Miembros) van siempre.
export const OPTIONAL_MODULES = [
  { key: "atletas", href: "/atletas", label: "Atletas" },
  { key: "entrenamientos", href: "/entrenamientos", label: "Entrenamientos" },
  { key: "calendario", href: "/calendario", label: "Calendario" },
  { key: "noticias", href: "/noticias", label: "Noticias" },
] as const;
