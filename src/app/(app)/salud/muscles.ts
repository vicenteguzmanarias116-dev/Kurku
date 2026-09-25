// Zonas musculares sobre viewBox 200x280. Cada zona es un "vientre muscular"
// con tendones angostos en las puntas y panza ancha al medio (no un óvalo
// liso): así se lee como músculo y no como plastilina.
// Los `id` se conservan exactos: son la clave que ya existe en
// `health_checkins.muscle_pain` para atletas reales.
export type Zone = { id: string; label: string; d: string };

type Spec = { id: string; label: string; cx: number; cy: number; w: number; h: number; tw?: number };

/** Forma de vientre muscular: angosto en las puntas (tendones), ancho al medio. */
function belly(cx: number, cy: number, w: number, h: number, tw = w * 0.4): string {
  const top = cy - h;
  const bot = cy + h;
  const up = cy - h * 0.32;
  const lo = cy + h * 0.32;
  return [
    `M ${cx - tw},${top}`,
    `C ${cx - w},${top + h * 0.18} ${cx - w},${up} ${cx - w},${cy}`,
    `C ${cx - w},${lo} ${cx - w},${bot - h * 0.18} ${cx - tw},${bot}`,
    `L ${cx + tw},${bot}`,
    `C ${cx + w},${bot - h * 0.18} ${cx + w},${lo} ${cx + w},${cy}`,
    `C ${cx + w},${up} ${cx + w},${top + h * 0.18} ${cx + tw},${top}`,
    "Z",
  ].join(" ");
}

function build(specs: Spec[]): Zone[] {
  return specs.map((s) => ({
    id: s.id,
    label: s.label,
    d: belly(s.cx, s.cy, s.w, s.h, s.tw),
  }));
}

const FRONT_SPECS: Spec[] = [
  { id: "cuello", label: "Cuello", cx: 100, cy: 48, w: 11, h: 15, tw: 6 },
  { id: "hombro_izq", label: "Hombro izquierdo", cx: 60, cy: 66, w: 15, h: 12, tw: 6 },
  { id: "hombro_der", label: "Hombro derecho", cx: 140, cy: 66, w: 15, h: 12, tw: 6 },
  { id: "pecho", label: "Pecho", cx: 100, cy: 76, w: 26, h: 19, tw: 4 },
  { id: "biceps_izq", label: "Bíceps izquierdo", cx: 46, cy: 100, w: 10, h: 22, tw: 4 },
  { id: "biceps_der", label: "Bíceps derecho", cx: 154, cy: 100, w: 10, h: 22, tw: 4 },
  { id: "abdomen", label: "Abdomen", cx: 100, cy: 116, w: 21, h: 22, tw: 9 },
  { id: "antebrazo_izq", label: "Antebrazo izquierdo", cx: 41, cy: 140, w: 8, h: 20, tw: 3 },
  { id: "antebrazo_der", label: "Antebrazo derecho", cx: 159, cy: 140, w: 8, h: 20, tw: 3 },
  { id: "cuadriceps_izq", label: "Cuádriceps izquierdo", cx: 84, cy: 168, w: 12, h: 32, tw: 5 },
  { id: "cuadriceps_der", label: "Cuádriceps derecho", cx: 116, cy: 168, w: 12, h: 32, tw: 5 },
  { id: "rodilla_izq", label: "Rodilla izquierda", cx: 84, cy: 204, w: 9, h: 7, tw: 5 },
  { id: "rodilla_der", label: "Rodilla derecha", cx: 116, cy: 204, w: 9, h: 7, tw: 5 },
  { id: "tibial_izq", label: "Tibial izquierdo", cx: 84, cy: 236, w: 8, h: 26, tw: 4 },
  { id: "tibial_der", label: "Tibial derecho", cx: 116, cy: 236, w: 8, h: 26, tw: 4 },
];

const BACK_SPECS: Spec[] = [
  { id: "trapecio", label: "Trapecio", cx: 100, cy: 56, w: 24, h: 12, tw: 4 },
  { id: "espalda_alta", label: "Espalda alta", cx: 100, cy: 82, w: 26, h: 18, tw: 8 },
  { id: "triceps_izq", label: "Tríceps izquierdo", cx: 46, cy: 100, w: 10, h: 22, tw: 4 },
  { id: "triceps_der", label: "Tríceps derecho", cx: 154, cy: 100, w: 10, h: 22, tw: 4 },
  { id: "espalda_baja", label: "Espalda baja", cx: 100, cy: 118, w: 20, h: 19, tw: 8 },
  { id: "antebrazo_izq_b", label: "Antebrazo izquierdo", cx: 41, cy: 140, w: 8, h: 20, tw: 3 },
  { id: "antebrazo_der_b", label: "Antebrazo derecho", cx: 159, cy: 140, w: 8, h: 20, tw: 3 },
  { id: "gluteo_izq", label: "Glúteo izquierdo", cx: 84, cy: 150, w: 13, h: 14, tw: 6 },
  { id: "gluteo_der", label: "Glúteo derecho", cx: 116, cy: 150, w: 13, h: 14, tw: 6 },
  { id: "isquios_izq", label: "Isquiotibial izquierdo", cx: 84, cy: 184, w: 12, h: 22, tw: 5 },
  { id: "isquios_der", label: "Isquiotibial derecho", cx: 116, cy: 184, w: 12, h: 22, tw: 5 },
  { id: "gemelo_izq", label: "Gemelo izquierdo", cx: 84, cy: 232, w: 9, h: 24, tw: 4 },
  { id: "gemelo_der", label: "Gemelo derecho", cx: 116, cy: 232, w: 9, h: 24, tw: 4 },
];

export const FRONT: Zone[] = build(FRONT_SPECS);
export const BACK: Zone[] = build(BACK_SPECS);

// Silueta decorativa (no clickeable): cabeza, torso, brazos. Las piernas
// las definen directamente los músculos (cuádriceps/isquios/gemelos): un
// contorno de pantalón aparte quedaba flojo y desalineado.
export const SILHOUETTE =
  "M100,18 a14,14 0 1,0 0.1,0 Z " +
  "M76,50 C58,56 47,74 44,102 L38,168 L43,168 L51,104 C54,82 63,66 76,58 Z " +
  "M124,50 C142,56 153,74 156,102 L162,168 L157,168 L149,104 C146,82 137,66 124,58 Z " +
  "M76,56 C64,80 61,108 68,144 L70,170 L130,170 L132,144 C139,108 136,80 124,56 " +
  "C116,50 84,50 76,56 Z";

// Líneas finas de definición muscular (linea alba, pectoral, cuádriceps…),
// solo decorativas, encima de la silueta y debajo de las zonas clickeables.
export const DEFINITION_FRONT =
  "M100,96 L100,138 " + // linea alba
  "M76,66 C86,74 94,78 100,78 C106,78 114,74 124,66 " + // línea inferior del pecho
  "M84,138 L84,198 M116,138 L116,198"; // separación de cuádriceps

export const DEFINITION_BACK =
  "M100,66 L100,96 " + // columna dorsal
  "M76,70 C86,66 94,64 100,64 C106,64 114,66 124,70 " + // trapecio inferior
  "M84,160 L84,208 M116,160 L116,208"; // separación isquiotibiales
