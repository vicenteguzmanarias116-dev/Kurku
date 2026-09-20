import Link from "next/link";
import { rajdhani } from "../fonts";

type EventItem = {
  kind: "event";
  id: string;
  at: string;
  title: string;
  planType: string | null;
  eventKind: string;
  href: string;
};
type CheckinItem = { kind: "checkin"; at: string; done: boolean; href: "/salud" };
export type AgendaItem = EventItem | CheckinItem;

const PLAN_LABEL: Record<string, string> = {
  gym: "Gym",
  bike: "Bici",
  sailing: "Vela",
  other: "Otro",
};

function borderColor(item: AgendaItem) {
  if (item.kind === "checkin") return item.done ? "border-l-ok" : "border-l-warn";
  if (item.eventKind === "regatta") return "border-l-brand-strong";
  if (item.planType === "gym") return "border-l-brand";
  if (item.planType === "bike") return "border-l-ok";
  if (item.planType === "sailing") return "border-l-info";
  return "border-l-line-strong";
}

export default function Agenda({ items }: { items: AgendaItem[] }) {
  const byDay = new Map<string, AgendaItem[]>();
  for (const item of items) {
    const key = item.at.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }
  const days = [...byDay.keys()].sort();

  if (!days.length) {
    return <p className="text-sm text-ink-3">No hay nada agendado en los próximos 21 días.</p>;
  }

  return (
    <div className="space-y-4">
      {days.map((key) => {
        const d = new Date(key + "T00:00:00");
        return (
          <div key={key} className="flex gap-4">
            <div className="w-14 shrink-0 pt-1 text-center">
              <p className="text-xs uppercase text-ink-3">
                {d.toLocaleDateString("es-PE", { weekday: "short" })}
              </p>
              <p className={`${rajdhani.className} text-2xl font-bold leading-none`}>
                {d.getDate()}
              </p>
              <p className="text-xs text-ink-3">
                {d.toLocaleDateString("es-PE", { month: "short" })}
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {byDay.get(key)!.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg border border-line border-l-4 bg-surface px-3 py-2.5 text-sm hover:bg-sunken ${borderColor(item)}`}
                >
                  <span className="w-11 shrink-0 text-xs text-ink-3">
                    {item.at.slice(11, 16)}
                  </span>
                  <span className="flex-1 text-ink-2">
                    {item.kind === "checkin" ? "Check-in de salud" : item.title}
                    {item.kind === "event" && item.planType && (
                      <span className="ml-1 text-ink-3">· {PLAN_LABEL[item.planType]}</span>
                    )}
                  </span>
                  {item.kind === "checkin" && (
                    <span className={item.done ? "text-ok-text" : "text-warn-text"}>
                      {item.done ? "✓" : "pendiente"}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
