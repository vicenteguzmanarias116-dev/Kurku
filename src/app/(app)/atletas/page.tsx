import Link from "next/link";
import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani, mono } from "../fonts";
import InviteLink from "./InviteLink";

type Athlete = {
  id: string;
  full_name: string;
  boat_class: string | null;
  weight_kg: number | null;
  active: boolean;
};

export default async function AtletasPage() {
  const { supabase, profile } = await requireUser();
  const { data: athletes } = await supabase
    .from("athletes")
    .select("id, full_name, boat_class, weight_kg, active")
    .order("full_name");

  const staff = isStaff(profile);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}>
          Atletas
        </h2>
        {staff && (
          <Link
            href="/atletas/nuevo"
            className={`${mono.className} cut-corner bg-[#FF5A36] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]`}
          >
            Nuevo atleta
          </Link>
        )}
      </div>

      {staff && profile?.team_id && <InviteLink teamId={profile.team_id} />}

      <div className="cut-corner border border-cyan-400/20 bg-[#0D141E] p-6">
        <table className="w-full text-sm">
          <thead
            className={`${mono.className} text-left text-[11px] uppercase tracking-wider text-white/40`}
          >
            <tr>
              <th className="py-1 font-normal">Nombre</th>
              <th className="font-normal">Clase</th>
              <th className="font-normal">Peso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(athletes as Athlete[] | null)?.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="py-2.5">
                  {a.full_name}
                  {!a.active && (
                    <span className="ml-2 text-xs text-white/30">inactivo</span>
                  )}
                </td>
                <td className="text-white/70">{a.boat_class ?? "—"}</td>
                <td className="tabular-nums text-white/70">
                  {a.weight_kg ? `${a.weight_kg} kg` : "—"}
                </td>
                <td className="text-right">
                  {staff && (
                    <Link
                      href={`/atletas/${a.id}`}
                      className="text-cyan-300 hover:underline"
                    >
                      editar
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {!athletes?.length && (
              <tr>
                <td colSpan={4} className="py-3 text-white/30">
                  Sin atletas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
