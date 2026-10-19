// Colores de la franja de un evento. Las clases van completas para que Tailwind las detecte.
export const EVENT_COLORS = {
  azul: { label: "Azul", chip: "bg-info-soft text-info-text", dot: "bg-info" },
  naranja: { label: "Naranja", chip: "bg-brand-soft text-brand-text", dot: "bg-brand" },
  verde: { label: "Verde", chip: "bg-ok-soft text-ok-text", dot: "bg-ok" },
  ambar: { label: "Ámbar", chip: "bg-warn-soft text-warn-text", dot: "bg-warn" },
  rojo: { label: "Rojo", chip: "bg-bad-soft text-bad-text", dot: "bg-bad" },
  morado: { label: "Morado", chip: "bg-[#f3e8ff] text-[#7e22ce]", dot: "bg-[#9333ea]" },
  gris: { label: "Gris", chip: "bg-sunken text-ink-2", dot: "bg-ink-3" },
} as const;

export type EventColor = keyof typeof EVENT_COLORS;

export const isEventColor = (c: unknown): c is EventColor =>
  typeof c === "string" && c in EVENT_COLORS;

/** Color elegido, o por defecto según el tipo (regata naranja, el resto azul). */
export function chipClass(color: string | null | undefined, kind: string) {
  if (isEventColor(color)) return EVENT_COLORS[color].chip;
  return kind === "regatta" ? EVENT_COLORS.naranja.chip : EVENT_COLORS.azul.chip;
}
