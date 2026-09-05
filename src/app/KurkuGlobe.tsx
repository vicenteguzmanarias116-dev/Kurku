"use client";

import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

// avatar naranja de marca en SVG inline: sin depender de un asset externo
const AVATAR = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="32" fill="%2305080D"/><circle cx="32" cy="32" r="30" fill="none" stroke="%23FF5A36" stroke-width="2"/><text x="32" y="42" font-family="sans-serif" font-size="28" font-weight="700" fill="%23FF5A36" text-anchor="middle">A</text></svg>',
)}`;

const MARKERS: GlobeMarker[] = [
  { lat: -12.05, lng: -77.04, src: AVATAR, label: "Los Avengers · Perú" },
];

export default function KurkuGlobe() {
  return (
    <Globe3D
      markers={MARKERS}
      config={{
        atmosphereColor: "#FF5A36",
        atmosphereIntensity: 14,
        bumpScale: 5,
        autoRotateSpeed: 0.3,
        initialRotation: { x: 0.15, y: 2.4 },
      }}
    />
  );
}
