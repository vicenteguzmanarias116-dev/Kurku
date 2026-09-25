import type { Profile } from "@/lib/auth";

// Herramientas que el admin puede prender/apagar en el nav del equipo.
// Las que no están acá (Página del equipo, Panel, Miembros) van siempre.
export const OPTIONAL_MODULES = [
  { key: "atletas", href: "/atletas", label: "Atletas" },
  { key: "rutina", href: "/rutina", label: "Rutina" },
  { key: "entrenamientos", href: "/entrenamientos", label: "Entrenamientos" },
  { key: "calendario", href: "/calendario", label: "Calendario" },
  { key: "salud", href: "/salud", label: "Salud" },
  { key: "lesiones", href: "/lesiones", label: "Lesiones" },
  { key: "mensajes", href: "/mensajes", label: "Mensajes" },
  { key: "noticias", href: "/noticias", label: "Noticias" },
] as const;

export type NavItem = { key: string; href: string; label: string };

const ATHLETE_PRIMARY: NavItem[] = [
  { key: "dashboard", href: "/dashboard", label: "Hoy" },
  { key: "rutina", href: "/rutina", label: "Rutina" },
  { key: "calendario", href: "/calendario", label: "Calendario" },
  { key: "pagina-equipo", href: "/pagina-equipo", label: "Equipo" },
  { key: "mensajes", href: "/mensajes", label: "Mensajes" },
];
const ATHLETE_MORE: NavItem[] = [
  { key: "salud", href: "/salud", label: "Salud" },
  { key: "noticias", href: "/noticias", label: "Noticias" },
  { key: "cuenta", href: "/cuenta", label: "Mi cuenta" },
];

const STAFF_PRIMARY: NavItem[] = [
  { key: "dashboard", href: "/dashboard", label: "Panel" },
  { key: "calendario", href: "/calendario", label: "Calendario" },
  { key: "atletas", href: "/atletas", label: "Atletas" },
  { key: "pagina-equipo", href: "/pagina-equipo", label: "Equipo" },
];
const STAFF_MORE: NavItem[] = [
  { key: "rutina", href: "/rutina", label: "Rutina" },
  { key: "salud", href: "/salud", label: "Salud" },
  { key: "lesiones", href: "/lesiones", label: "Lesiones" },
  { key: "entrenamientos", href: "/entrenamientos", label: "Entrenamientos" },
  { key: "mensajes", href: "/mensajes", label: "Mensajes" },
  { key: "noticias", href: "/noticias", label: "Noticias" },
  { key: "miembros", href: "/equipo/miembros", label: "Miembros" },
  { key: "cuenta", href: "/cuenta", label: "Mi cuenta" },
];

export function navFor(
  role: Profile["role"],
  hidden: Set<string>
): { primary: NavItem[]; more: NavItem[] } {
  const drop = (items: NavItem[]) =>
    items.filter((i) => i.key === "miembros" || i.key === "cuenta" || !hidden.has(i.key));

  if (role === "athlete") {
    return { primary: drop(ATHLETE_PRIMARY), more: drop(ATHLETE_MORE) };
  }
  const more = STAFF_MORE.filter((i) => i.key !== "miembros" || role === "admin");
  return { primary: drop(STAFF_PRIMARY), more: drop(more) };
}
