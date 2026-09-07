import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { rajdhani, mono } from "../../fonts";

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

const PLAN_LABEL: Record<string, string> = {
  gym: "Gym",
  bike: "Bici",
  sailing: "Vela",
  other: "Otro",
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
        className={`${mono.className} inline-flex items-center gap-1 text-xs uppercase tracking-wider text-white/40 hover:text-cyan-300`}
      >
        ← Volver al calendario
      </Link>

      <div className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`${mono.className} border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
              isRegatta
                ? "border-[#FF5A36]/40 text-[#FF5A36]"
                : "border-cyan-400/40 text-cyan-300"
            }`}
          >
            {isRegatta ? "Regata" : event.kind === "training" ? "Entrenamiento" : "Otro"}
          </span>
          {event.plan_type && (
            <span
              className={`${mono.className} border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/50`}
            >
              {PLAN_LABEL[event.plan_type] ?? event.plan_type}
            </span>
          )}
          {event.athletes?.full_name && (
            <span className={`${mono.className} text-[10px] uppercase tracking-wider text-white/30`}>
              para {event.athletes.full_name}
            </span>
          )}
        </div>

        <h1 className={`${rajdhani.className} mt-3 text-3xl font-bold uppercase leading-tight sm:text-4xl`}>
          {event.title}
        </h1>

        <p className="mt-2 text-sm text-white/50">
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
          <p className="mt-4 whitespace-pre-wrap text-sm text-white/70">
            {event.description}
          </p>
        )}

        {event.plan_items && event.plan_items.length > 0 && (
          <div className="mt-6">
            <span className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}>
              Detalle de la sesión
            </span>
            <ul className="mt-2 divide-y divide-white/10 border border-white/10">
              {event.plan_items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className={`${mono.className} w-6 shrink-0 text-white/30`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
