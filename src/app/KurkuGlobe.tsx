"use client";

import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

export type PublicTeam = { id: string; name: string; logo_url: string };

// Sin lat/lng por equipo todavía (falta capturar ubicación real al crear el
// equipo). Mientras tanto los repartimos alrededor de Lima con un offset
// determinístico por índice, para que no se pisen entre sí.
function positionFor(i: number) {
  const lat = -12.05 + (i % 3) * 2.5;
  const lng = -77.04 + Math.floor(i / 3) * 3;
  return { lat, lng };
}

export default function KurkuGlobe({ teams }: { teams: PublicTeam[] }) {
  const markers: GlobeMarker[] = teams.map((t, i) => ({
    ...positionFor(i),
    src: t.logo_url,
    label: t.name,
    size: 0.09,
  }));

  return (
    <div className="cut-corner hud-frame group radar-grid relative border border-[#FF5A36]/20 bg-white/[0.02]">
      {markers.length === 0 ? (
        <div className="flex h-[420px] items-center justify-center text-sm text-white/30 sm:h-[520px]">
          Todavía no hay equipos con logo público.
        </div>
      ) : (
        <Globe3D
          markers={markers}
          config={{
            showAtmosphere: false,
            bumpScale: 5,
            autoRotateSpeed: 0.3,
            initialRotation: { x: 0.15, y: 2.4 },
            backgroundColor: "transparent",
          }}
        />
      )}
    </div>
  );
}
