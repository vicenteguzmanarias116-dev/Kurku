import Link from "next/link";
import { requireUser, isStaff } from "@/lib/auth";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Atletas</h2>
        {staff && (
          <Link
            href="/atletas/nuevo"
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white"
          >
            Nuevo atleta
          </Link>
        )}
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-zinc-500">
          <tr>
            <th className="py-1">Nombre</th>
            <th>Clase</th>
            <th>Peso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(athletes as Athlete[] | null)?.map((a) => (
            <tr key={a.id} className="border-t border-zinc-100">
              <td className="py-1.5">
                {a.full_name}
                {!a.active && (
                  <span className="ml-2 text-xs text-zinc-400">inactivo</span>
                )}
              </td>
              <td>{a.boat_class ?? "—"}</td>
              <td>{a.weight_kg ? `${a.weight_kg} kg` : "—"}</td>
              <td className="text-right">
                {staff && (
                  <Link href={`/atletas/${a.id}`} className="text-zinc-600 underline">
                    editar
                  </Link>
                )}
              </td>
            </tr>
          ))}
          {!athletes?.length && (
            <tr>
              <td colSpan={4} className="py-3 text-zinc-400">
                Sin atletas todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
