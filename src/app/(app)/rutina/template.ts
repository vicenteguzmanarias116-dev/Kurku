import type { Days, DayPlan, Exercise, InfoSection } from "./types";

const blankExercises = (n: number): Exercise[] =>
  Array.from({ length: n }, () => ({ name: "", sets_reps: "", note: "", weighted: true }));

const gym = (title: string, focus = ""): DayPlan => ({ kind: "gym", title, focus, exercises: blankExercises(6) });

/** Semana tipo (misma estructura que la rutina de referencia): el staff solo llena lo que falta. */
export const ROUTINE_TEMPLATE: { title: string; subtitle: string; days: Days; info: InfoSection[] } = {
  title: "Mi rutina",
  subtitle: "",
  days: {
    "1": gym("Torso A"),
    "2": { kind: "other", title: "Surf o cardio", notes: "Zona 2, 45–90 min a ritmo de conversación." },
    "3": gym("Piernas y core"),
    "4": { kind: "other", title: "Navegar o surf", notes: "" },
    "5": gym("Torso B"),
    "6": gym("Hombros y brazos"),
    "0": { kind: "rest", title: "Descanso", notes: "Caminar o nadar tranquilo." },
  },
  info: [
    { title: "Objetivo", items: [""] },
    { title: "Reglas", items: [""] },
    { title: "Cardio y comida", items: [""] },
    { title: "Regata y progreso", items: [""] },
  ],
};

/** Quita filas vacías antes de guardar: el atleta solo ve lo que el staff llenó. */
export function cleanRoutine(days: Days, info: InfoSection[]) {
  const cleanDays: Days = {};
  for (const [k, d] of Object.entries(days)) {
    if (!d) continue;
    cleanDays[k] =
      d.kind === "gym" ? { ...d, exercises: (d.exercises ?? []).filter((e) => e.name.trim() || e.sets_reps.trim()) } : d;
  }
  const cleanInfo = info
    .map((s) => ({ title: s.title.trim(), items: s.items.map((i) => i.trim()).filter(Boolean) }))
    .filter((s) => s.title && s.items.length);
  return { days: cleanDays, info: cleanInfo };
}
