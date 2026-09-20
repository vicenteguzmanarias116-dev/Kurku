// Zonas musculares como elipses (más orgánico que rectángulos) sobre
// viewBox 200x260. Los `id` se conservan exactos: son la clave que ya
// existe en `health_checkins.muscle_pain` para atletas reales.
export type Zone = { id: string; label: string; cx: number; cy: number; rx: number; ry: number };

export const FRONT: Zone[] = [
  { id: "cuello", label: "Cuello", cx: 100, cy: 49, rx: 10, ry: 7 },
  { id: "hombro_izq", label: "Hombro izquierdo", cx: 61, cy: 67, rx: 13, ry: 9 },
  { id: "hombro_der", label: "Hombro derecho", cx: 139, cy: 67, rx: 13, ry: 9 },
  { id: "pecho", label: "Pecho", cx: 100, cy: 75, rx: 24, ry: 17 },
  { id: "biceps_izq", label: "Bíceps izquierdo", cx: 47, cy: 98, rx: 9, ry: 20 },
  { id: "biceps_der", label: "Bíceps derecho", cx: 153, cy: 98, rx: 9, ry: 20 },
  { id: "abdomen", label: "Abdomen", cx: 100, cy: 113, rx: 20, ry: 19 },
  { id: "antebrazo_izq", label: "Antebrazo izquierdo", cx: 42, cy: 138, rx: 8, ry: 18 },
  { id: "antebrazo_der", label: "Antebrazo derecho", cx: 158, cy: 138, rx: 8, ry: 18 },
  { id: "cuadriceps_izq", label: "Cuádriceps izquierdo", cx: 89, cy: 162, rx: 11, ry: 28 },
  { id: "cuadriceps_der", label: "Cuádriceps derecho", cx: 111, cy: 162, rx: 11, ry: 28 },
  { id: "rodilla_izq", label: "Rodilla izquierda", cx: 89, cy: 198, rx: 10, ry: 6 },
  { id: "rodilla_der", label: "Rodilla derecha", cx: 111, cy: 198, rx: 10, ry: 6 },
  { id: "tibial_izq", label: "Tibial izquierdo", cx: 89, cy: 229, rx: 9, ry: 23 },
  { id: "tibial_der", label: "Tibial derecho", cx: 111, cy: 229, rx: 9, ry: 23 },
];

export const BACK: Zone[] = [
  { id: "trapecio", label: "Trapecio", cx: 100, cy: 54, rx: 22, ry: 10 },
  { id: "espalda_alta", label: "Espalda alta", cx: 100, cy: 80, rx: 24, ry: 16 },
  { id: "triceps_izq", label: "Tríceps izquierdo", cx: 47, cy: 98, rx: 9, ry: 20 },
  { id: "triceps_der", label: "Tríceps derecho", cx: 153, cy: 98, rx: 9, ry: 20 },
  { id: "espalda_baja", label: "Espalda baja", cx: 100, cy: 113, rx: 20, ry: 17 },
  { id: "antebrazo_izq_b", label: "Antebrazo izquierdo", cx: 42, cy: 138, rx: 8, ry: 18 },
  { id: "antebrazo_der_b", label: "Antebrazo derecho", cx: 158, cy: 138, rx: 8, ry: 18 },
  { id: "gluteo_izq", label: "Glúteo izquierdo", cx: 89, cy: 143, rx: 11, ry: 13 },
  { id: "gluteo_der", label: "Glúteo derecho", cx: 111, cy: 143, rx: 11, ry: 13 },
  { id: "isquios_izq", label: "Isquiotibial izquierdo", cx: 89, cy: 176, rx: 11, ry: 20 },
  { id: "isquios_der", label: "Isquiotibial derecho", cx: 111, cy: 176, rx: 11, ry: 20 },
  { id: "gemelo_izq", label: "Gemelo izquierdo", cx: 89, cy: 229, rx: 9, ry: 23 },
  { id: "gemelo_der", label: "Gemelo derecho", cx: 111, cy: 229, rx: 9, ry: 23 },
];

// Silueta decorativa (no clickeable) para dar contexto de cuerpo detrás
// de las zonas: cabeza + torso + brazos + piernas, mismo viewBox.
export const SILHOUETTE =
  "M100,20 a14,14 0 1,0 0.1,0 Z " +
  "M74,52 C58,58 48,75 45,100 L40,158 L44,158 L52,102 C55,82 62,68 74,60 Z " +
  "M126,52 C142,58 152,75 155,100 L160,158 L156,158 L148,102 C145,82 138,68 126,60 Z " +
  "M74,58 C64,80 62,105 68,135 L70,158 L130,158 L132,135 C138,105 136,80 126,58 " +
  "C118,52 82,52 74,58 Z " +
  "M70,158 L66,252 L94,252 L98,160 Z " +
  "M130,158 L134,252 L106,252 L102,160 Z";
