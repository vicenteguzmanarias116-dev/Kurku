export const SLEEP = ["Malísimo", "Muy mal", "Mal", "Normal", "Bien", "Muy bien", "Excelente"];
export const MOOD = ["Pésimo", "Muy mal", "Bajón", "Normal", "Bien", "Muy bien", "Excelente"];
export const SORE = ["Nada", "Casi nada", "Poco", "Algo", "Bastante", "Mucho", "Muchísimo"];

/** "good-high": 7 es bueno (sueño, ánimo). "good-low": 7 es malo (dolor). */
export type ScaleTone = "good-high" | "good-low";

export function scaleWord(words: string[], value: number | null) {
  if (!value) return "—";
  return words[value - 1] ?? "—";
}
