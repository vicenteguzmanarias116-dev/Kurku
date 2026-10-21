export type Exercise = {
  name: string;
  sets_reps: string;
  note?: string;
  weighted?: boolean; // default true
};

export type DayPlan = {
  kind: "gym" | "other" | "rest";
  title: string;
  focus?: string;
  notes?: string; // solo para kind !== "gym"
  exercises?: Exercise[]; // solo para kind === "gym"
};

export type Days = Partial<Record<string, DayPlan>>; // clave "0".."6"

export type InfoSection = { title: string; items: string[] };

export type LogEntry = { id: string; kg: number | null; reps: number | null; logged_at: string };

export const WEEKDAY_LABEL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const WEEKDAY_SHORT = ["D", "L", "M", "M", "J", "V", "S"];
