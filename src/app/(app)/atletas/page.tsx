import Link from "next/link";
import { requireUser, isStaff } from "@/lib/auth";
import PageHead from "../PageHead";
import InviteLink from "./InviteLink";
import ExportButton from "../ExportButton";
import { Card, LinkButton, Empty } from "../ui";

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
      <div className="flex items-end justify-between gap-4">
        <PageHead eyebrow="Flota · ILCA" title="Atletas" />
        {staff && (
          <div className="mb-7 flex shrink-0 gap-2">
            <ExportButton type="atletas" />
            <LinkButton href="/atletas/nuevo" variant="primary" size="sm">
              Nuevo atleta
            </LinkButton>
          </div>
        )}
      </div>

      {staff && profile?.team_id && <InviteLink teamId={profile.team_id} />}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="text-left text-xs text-ink-3">
            <tr>
              <th className="py-1 font-medium">Nombre</th>
              <th className="font-medium">Clase</th>
              <th className="font-medium">Peso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(athletes as Athlete[] | null)?.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="py-2.5">
                  {a.full_name}
                  {!a.active && <span className="ml-2 text-xs text-ink-3">inactivo</span>}
                </td>
                <td className="text-ink-2">{a.boat_class ?? "—"}</td>
                <td className="tabular-nums text-ink-2">
                  {a.weight_kg ? `${a.weight_kg} kg` : "—"}
                </td>
                <td className="text-right">
                  {staff && (
                    <Link href={`/atletas/${a.id}`} className="text-brand-text hover:underline">
                      editar
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {!athletes?.length && (
              <tr>
                <td colSpan={4}>
                  <Empty title="Sin atletas todavía." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
