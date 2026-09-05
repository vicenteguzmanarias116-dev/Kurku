import { notFound, redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import { deleteAthlete } from "../actions";
import { rajdhani } from "../../fonts";
import AthleteFormClient from "../AthleteFormClient";

export default async function AthleteForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) redirect("/atletas");

  const isNew = id === "nuevo";
  let a: Record<string, unknown> = { active: true };
  if (!isNew) {
    const { data } = await supabase.from("athletes").select("*").eq("id", id).single();
    if (!data) notFound();
    a = data;
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}>
        {isNew ? "Nuevo atleta" : "Editar atleta"}
      </h2>
      <AthleteFormClient id={id} athlete={a} />

      {!isNew && (
        <form action={deleteAthlete}>
          <input type="hidden" name="id" value={id} />
          <button className="text-sm text-red-400 hover:underline">
            Eliminar atleta
          </button>
        </form>
      )}
    </div>
  );
}
