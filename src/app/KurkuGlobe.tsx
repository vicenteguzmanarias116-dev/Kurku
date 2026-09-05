"use client";

import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

// avatar naranja de marca en SVG inline: sin depender de un asset externo
const AVATAR = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <circle cx="32" cy="32" r="32" fill="#FF5A36"/>
    <text x="32" y="43" font-family="sans-serif" font-size="30" font-weight="700" fill="#05080D" text-anchor="middle">A</text>
  </svg>`,
)}`;

const MARKERS: GlobeMarker[] = [
  { lat: -12.05, lng: -77.04, src: AVATAR, label: "Los Avengers · Perú", size: 0.09 },
];

export default function KurkuGlobe() {
  return (
    <div className="cut-corner hud-frame group radar-grid relative border border-[#FF5A36]/20 bg-white/[0.02]">
      <Globe3D
        markers={MARKERS}
        config={{
          showAtmosphere: true,
          atmosphereColor: "#FF5A36",
          atmosphereIntensity: 2.2,
          bumpScale: 5,
          autoRotateSpeed: 0.3,
          initialRotation: { x: 0.15, y: 2.4 },
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
