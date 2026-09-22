import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { rajdhani } from "../../fonts";
import { Card, Badge } from "../../ui";
import { PLAN_LABEL } from "../planTypes";

type EventDetail = {
  id: string;
  kind: string;
  title: string;
  starts_at: string;
  location: string | null;
  description: string | null;
  plan_type: string | null;
  plan_items: { label: string }[] | null;
  athletes: { full_name: string } | null;
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();

  const { data: event } = await supabase
    .from("events")
    .select(
      "id, kind, title, starts_at, location, description, plan_type, plan_items, athletes(full_name)",
    )
    .eq("id", id)
    .single<EventDetail>();

  if (!event) notFound();

  const isRegatta = event.kind === "regatta";
  const date = new Date(event.starts_at);

  return (
    <div className="space-y-6">
      <Link
        href="/calendario"
        className="inline-flex items-center gap-1 text-sm text-ink-3 hover:text-brand-text"
      >
        ← Volver al calendario
      </Link>

      <Card className="sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isRegatta ? "brand" : "info"}>
            {isRegatta ? "Regata" : event.kind === "training" ? "Entrenamiento" : "Otro"}
          </Badge>
          {event.plan_type && (
            <Badge>{PLAN_LABEL[event.plan_type] ?? event.plan_type}</Badge>
          )}
          {event.athletes?.full_name && (
            <span className="text-xs text-ink-3">para {event.athletes.full_name}</span>
          )}
        </div>

        <h1 className={`${rajdhani.className} mt-3 text-3xl font-bold leading-tight sm:text-4xl`}>
          {event.title}
        </h1>

        <p className="mt-2 text-sm text-ink-2">
          {date.toLocaleDateString("es-PE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          ·{" "}
          {date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
          {event.location && <> · {event.location}</>}
        </p>

        {event.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-ink-2">
            {event.description}
          </p>
        )}

        {event.plan_items && event.plan_items.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-text">
              Detalle de la sesión
            </p>
            <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
              {event.plan_items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="w-6 shrink-0 text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
