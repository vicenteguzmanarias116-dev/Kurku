export const PLAN_TYPES = [
  { value: "running", emoji: "🏃", label: "Correr" },
  { value: "cycling", emoji: "🚴", label: "Ciclismo" },
  { value: "swimming", emoji: "🏊", label: "Natación" },
  { value: "gym", emoji: "🏋️", label: "Gimnasio" },
  { value: "mobility", emoji: "🤸", label: "Movilidad / Estiramiento" },
  { value: "yoga", emoji: "🧘", label: "Yoga" },
  { value: "hiking", emoji: "🚶", label: "Caminata / Hiking" },
  { value: "rowing", emoji: "🚣", label: "Remo / Kayak" },
  { value: "surf", emoji: "🏄", label: "Surf / SUP" },
  { value: "sailing", emoji: "⛵", label: "Navegación / Regata" },
] as const;

export const PLAN_LABEL: Record<string, string> = Object.fromEntries(
  PLAN_TYPES.map((p) => [p.value, `${p.emoji} ${p.label}`]),
);
