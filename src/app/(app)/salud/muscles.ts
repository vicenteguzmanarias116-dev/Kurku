// Mapa muscular anatómico sobre viewBox 300x760 (eje central x=150).
// Cada zona clickeable agrupa varios músculos reales (cabezas, fascículos).
// Las formas se dibujan solo para el lado izquierdo del dibujo y el derecho
// se obtiene espejando. Los `id` viejos se conservan: son la clave que ya
// existe en `health_checkins.muscle_pain`.
export type Zone = { id: string; label: string; d: string };
type Pt = [number, number];

export const VIEWBOX = "0 0 300 760";
const CX = 150;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Curva cerrada suave que pasa por todos los puntos (Catmull-Rom → bézier). */
function smooth(p: Pt[], k = 1): string {
  const n = p.length;
  let d = `M${r1(p[0][0])},${r1(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * k;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * k;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * k;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * k;
    d += `C${r1(c1x)},${r1(c1y)} ${r1(c2x)},${r1(c2y)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d + "Z";
}

/** Músculo alargado: línea central + semiancho en cada punto. */
function strip(c: Pt[], w: number[]): Pt[] {
  const left: Pt[] = [];
  const right: Pt[] = [];
  c.forEach((pt, i) => {
    const a = c[Math.max(0, i - 1)];
    const b = c[Math.min(c.length - 1, i + 1)];
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    left.push([pt[0] + nx * w[i], pt[1] + ny * w[i]]);
    right.push([pt[0] - nx * w[i], pt[1] - ny * w[i]]);
  });
  return [...left, ...right.reverse()];
}

const rr = (x: number, y: number, w: number, h: number, r = 4): Pt[] => [
  [x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r],
  [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r],
];
const ell = (cx: number, cy: number, rx: number, ry: number, n = 14): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });
const fl = (s: Pt[]): Pt[] => s.map(([x, y]) => [2 * CX - x, y] as Pt);
const path = (shapes: Pt[][]) => shapes.map((s) => smooth(s)).join("");
const both = (s: Pt[][]) => [...s, ...s.map(fl)];

const zone = (id: string, label: string, shapes: Pt[][]): Zone => ({ id, label, d: path(shapes) });
/** Zona doble (centro del cuerpo): se dibuja el lado izquierdo y su espejo. */
const mid = (id: string, label: string, shapes: Pt[][]): Zone => zone(id, label, both(shapes));
/** Par izquierda/derecha: `suffix` se agrega al final del id (p. ej. "_b" en la espalda). */
const pair = (id: string, label: [string, string], shapes: Pt[][], suffix = ""): Zone[] => [
  zone(`${id}_izq${suffix}`, label[0], shapes),
  zone(`${id}_der${suffix}`, label[1], shapes.map(fl)),
];

// ─── FRENTE ────────────────────────────────────────────────────────────────
export const FRONT: Zone[] = [
  mid("cuello", "Cuello", [
    strip([[130, 104], [140, 118], [147, 134]], [3.5, 5, 3]),
    strip([[126, 118], [112, 130], [100, 140]], [4, 7, 3]),
  ]),
  ...pair("hombro", ["Hombro izquierdo", "Hombro derecho"], [
    [[108, 134], [92, 136], [76, 146], [67, 166], [68, 190], [78, 208], [92, 202], [100, 180], [106, 156]],
  ]),
  mid("pecho", "Pecho", [
    [[147, 152], [130, 147], [112, 150], [104, 162], [104, 182], [110, 206], [122, 224], [136, 232], [147, 228]],
  ]),
  ...pair("biceps", ["Bíceps izquierdo", "Bíceps derecho"], [
    strip([[90, 204], [82, 236], [72, 270]], [11, 15, 6]),
    strip([[74, 214], [63, 244], [57, 268]], [5, 8, 3]),
  ]),
  mid("abdomen", "Abdomen", [
    rr(125, 238, 22, 24), rr(125, 266, 22, 24), rr(125, 294, 22, 24), rr(127, 322, 20, 24),
  ]),
  ...pair("oblicuo", ["Oblicuo izquierdo", "Oblicuo derecho"], [
    [[108, 228], [118, 236], [120, 262], [120, 300], [118, 338], [110, 368], [98, 362], [96, 326], [98, 288], [100, 250]],
  ]),
  ...pair("antebrazo", ["Antebrazo izquierdo", "Antebrazo derecho"], [
    strip([[68, 292], [58, 330], [46, 388]], [13, 12, 4]),
    strip([[54, 292], [44, 326], [36, 370]], [7, 7, 2]),
    strip([[82, 290], [72, 326], [60, 380]], [6, 6, 2]),
  ]),
  ...pair("cuadriceps", ["Cuádriceps izquierdo", "Cuádriceps derecho"], [
    strip([[102, 410], [100, 470], [104, 530]], [10, 16, 7]),
    strip([[122, 408], [120, 470], [120, 530]], [8, 13, 6]),
    strip([[138, 450], [134, 498], [128, 540]], [5, 12, 6]),
  ]),
  ...pair("aductor", ["Aductor izquierdo", "Aductor derecho"], [
    strip([[142, 404], [139, 444], [134, 486]], [5, 7, 3]),
  ]),
  ...pair("rodilla", ["Rodilla izquierda", "Rodilla derecha"], [
    [[110, 546], [126, 544], [134, 552], [132, 572], [120, 580], [108, 572], [106, 556]],
    strip([[102, 556], [102, 578]], [4, 4]),
    strip([[138, 556], [138, 578]], [4, 4]),
  ]),
  ...pair("tibial", ["Tibial izquierdo", "Tibial derecho"], [
    strip([[122, 584], [120, 640], [118, 708]], [9, 10, 3]),
    strip([[104, 592], [104, 640], [108, 700]], [5, 8, 3]),
    strip([[136, 590], [134, 636], [128, 680]], [5, 8, 2]),
  ]),
];

// ─── ESPALDA ───────────────────────────────────────────────────────────────
export const BACK: Zone[] = [
  mid("trapecio", "Trapecio", [
    [[147, 100], [130, 108], [112, 126], [102, 142], [108, 162], [124, 196], [138, 232], [147, 262]],
  ]),
  ...pair("deltoide_post", ["Deltoides posterior izquierdo", "Deltoides posterior derecho"], [
    [[102, 138], [88, 140], [74, 150], [67, 170], [70, 192], [80, 206], [94, 198], [102, 176], [104, 154]],
  ]),
  mid("espalda_alta", "Espalda alta", [
    [[102, 152], [96, 172], [98, 198], [108, 206], [118, 196], [114, 172], [110, 156]],
    strip([[98, 204], [90, 222], [84, 236]], [4, 5, 3]),
    [[130, 196], [120, 210], [118, 238], [128, 258], [140, 246], [142, 214]],
  ]),
  ...pair("dorsal", ["Dorsal ancho izquierdo", "Dorsal ancho derecho"], [
    [[98, 212], [92, 236], [95, 272], [104, 312], [118, 342], [136, 346], [138, 318], [130, 284], [120, 252], [110, 224]],
  ]),
  ...pair("triceps", ["Tríceps izquierdo", "Tríceps derecho"], [
    strip([[92, 164], [82, 212], [70, 266]], [11, 16, 6]),
    strip([[78, 176], [68, 216], [62, 258]], [5, 8, 3]),
  ]),
  mid("espalda_baja", "Espalda baja", [
    strip([[144, 262], [144, 312], [144, 354]], [4, 6, 4]),
    [[132, 336], [130, 356], [140, 372], [147, 374], [147, 338]],
  ]),
  ...pair("antebrazo", ["Antebrazo izquierdo", "Antebrazo derecho"], [
    strip([[68, 292], [58, 330], [46, 388]], [13, 12, 4]),
    strip([[54, 294], [44, 330], [36, 372]], [7, 7, 2]),
    strip([[82, 292], [72, 330], [60, 384]], [6, 6, 2]),
  ], "_b"),
  ...pair("gluteo", ["Glúteo izquierdo", "Glúteo derecho"], [
    [[147, 348], [128, 340], [108, 352], [98, 376], [100, 402], [114, 424], [134, 430], [147, 416]],
    [[122, 326], [108, 332], [98, 346], [108, 350], [122, 342]],
  ]),
  ...pair("isquios", ["Isquiotibial izquierdo", "Isquiotibial derecho"], [
    strip([[108, 430], [104, 480], [108, 540]], [10, 13, 6]),
    strip([[130, 430], [128, 480], [124, 540]], [9, 12, 5]),
  ]),
  ...pair("gemelo", ["Gemelo izquierdo", "Gemelo derecho"], [
    strip([[132, 556], [128, 604], [122, 654]], [9, 14, 3]),
    strip([[108, 556], [106, 600], [110, 646]], [8, 12, 3]),
    strip([[120, 640], [120, 680], [120, 716]], [10, 9, 3]),
  ]),
];

// ─── Base gris del cuerpo (cabeza, manos, pies, rellenos) ──────────────────
const hand: Pt[][] = [
  [[34, 392], [48, 392], [52, 412], [50, 436], [40, 444], [30, 434], [28, 412]],
  strip([[44, 440], [46, 476]], [3.2, 2]),
  strip([[38, 442], [36, 480]], [3.2, 2]),
  strip([[32, 438], [26, 472]], [3, 2]),
  strip([[50, 424], [62, 446]], [3.5, 2.5]),
];
const foot: Pt[][] = [
  [[110, 716], [132, 716], [134, 738], [136, 756], [106, 758], [100, 744]],
];
const limbFill: Pt[][] = [
  strip([[88, 160], [64, 284]], [22, 18]),
  strip([[64, 288], [42, 392]], [18, 10]),
  strip([[104, 395], [112, 545]], [24, 18]),
  strip([[116, 580], [118, 712]], [20, 10]),
];
const torsoFill: Pt[] = [
  [122, 132], [100, 142], [90, 162], [98, 204], [100, 262], [106, 330], [94, 380], [96, 398],
  [150, 404],
  [204, 398], [206, 380], [194, 330], [200, 262], [202, 204], [210, 162], [200, 142], [178, 132],
];

const baseFront: Pt[][] = [
  ell(150, 56, 29, 40),
  strip([[150, 92], [150, 128]], [17, 24]),
  torsoFill,
  ...limbFill.flatMap((s) => [s, fl(s)]),
  ...hand.flatMap((s) => [s, fl(s)]),
  ...foot.flatMap((s) => [s, fl(s)]),
];
const baseBack: Pt[][] = baseFront;

export const BODY_FRONT = path(baseFront);
export const BODY_BACK = path(baseBack);

export const HAIR_FRONT = path([
  [[121, 50], [124, 30], [136, 18], [150, 14], [164, 18], [176, 30], [179, 50], [172, 38], [150, 32], [128, 38]],
]);
export const HAIR_BACK = path([ell(150, 54, 29.5, 39)]);
