import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani } from "../fonts";
import PageHead from "../PageHead";
import { Input, Select, Textarea, Button } from "../ui";
import { getTodayCheckinStatus } from "../today";
import Agenda, { type AgendaItem } from "./Agenda";
import { PLAN_TYPES, PLAN_LABEL } from "./planTypes";

type EventRow = {
  id: string;
  kind: string;
  title: string;
  starts_at: string;
  location: string | null;
  description: string | null;
  athlete_id: string | null;
  plan_type: string | null;
  athletes: { full_name: string } | null;
};

async function addEvent(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");

  const kind = String(formData.get("kind") || "training");
  const planType = String(formData.get("plan_type") || "");
  const itemsRaw = String(formData.get("plan_items") || "");
  const plan_items = itemsRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((label) => ({ label }));

  const row = {
    team_id: profile!.team_id,
    kind,
    title: String(formData.get("title") || "").trim(),
    starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
    location: String(formData.get("location") || "") || null,
    description: String(formData.get("description") || "") || null,
    athlete_id: String(formData.get("athlete_id") || "") || null,
    plan_type: kind === "training" && planType ? planType : null,
    plan_items: plan_items.length ? plan_items : null,
  };
  if (!row.title || !formData.get("starts_at")) throw new Error("Falta título o fecha.");
  const { error } = await supabase.from("events").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/calendario");
}

async function delEvent(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  await supabase.from("events").delete().eq("id", String(formData.get("id")));
  revalidatePath("/calendario");
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}
/** lunes de la semana que contiene d */
function mondayOf(d: Date) {
  const day = (d.getDay() + 6) % 7; // lunes=0 ... domingo=6
  return addDays(d, -day);
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; d?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const staff = isStaff(profile);
  const sp = await searchParams;
  const view = sp.view === "semana" ? "semana" : sp.view === "mes" ? "mes" : "agenda";
  const anchor = sp.d && !Number.isNaN(Date.parse(sp.d)) ? new Date(sp.d) : new Date();

  const [{ data: events }, { data: athletes }, checkin] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, kind, title, starts_at, location, description, athlete_id, plan_type, athletes(full_name)",
      )
      .order("starts_at"),
    staff
      ? supabase.from("athletes").select("id, full_name").eq("active", true).order("full_name")
      : Promise.resolve({ data: null }),
    getTodayCheckinStatus(supabase, profile!),
  ]);

  const byDay = new Map<string, EventRow[]>();
  for (const e of (events as EventRow[] | null) ?? []) {
    const key = e.starts_at.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(e);
  }

  const monthStart = startOfMonth(anchor);
  const gridStart = mondayOf(monthStart);
  const monthDays = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const weekStart = mondayOf(anchor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const agendaItems: AgendaItem[] = [];
  if (view === "agenda") {
    const today0 = new Date();
    today0.setHours(0, 0, 0, 0);
    const horizon = addDays(today0, 21);
    for (const e of (events as EventRow[] | null) ?? []) {
      const at = new Date(e.starts_at);
      if (at < today0 || at >= horizon) continue;
      if (!staff && e.athlete_id && e.athlete_id !== checkin.athleteId) continue;
      agendaItems.push({
        kind: "event",
        id: e.id,
        at: e.starts_at,
        title: e.title,
        planType: e.plan_type,
        eventKind: e.kind,
        href: `/calendario/${e.id}`,
      });
    }
    if (checkin.athleteId) {
      agendaItems.push({
        kind: "checkin",
        at: `${ymd(today0)}T08:00:00`,
        done: checkin.done,
        href: "/salud",
      });
    }
  }

  const prevHref =
    view === "semana"
      ? `/calendario?view=semana&d=${ymd(addDays(weekStart, -7))}`
      : `/calendario?view=mes&d=${ymd(addMonths(monthStart, -1))}`;
  const nextHref =
    view === "semana"
      ? `/calendario?view=semana&d=${ymd(addDays(weekStart, 7))}`
      : `/calendario?view=mes&d=${ymd(addMonths(monthStart, 1))}`;
  const todayHref = `/calendario?view=${view === "semana" ? "semana" : "mes"}`;

  const label =
    view === "agenda"
      ? "Próximos 21 días"
      : view === "semana"
        ? `${weekDays[0].toLocaleDateString("es-PE", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}`
        : monthStart.toLocaleDateString("es-PE", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Regatas · Entrenos" title="Calendario" />

      {staff && (
        <details className="rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-medium text-brand-text">
            Añadir evento / plan
          </summary>
          <form
            action={addEvent}
            className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3"
          >
            <Input name="title" placeholder="Título" required />
            <Input name="starts_at" type="datetime-local" required />
            <Select name="kind">
              <option value="training">Entrenamiento</option>
              <option value="regatta">Regata</option>
              <option value="other">Otro</option>
            </Select>
            <Select name="plan_type">
              <option value="">Tipo de plan (opcional)</option>
              {PLAN_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.emoji} {p.label}
                </option>
              ))}
            </Select>
            <Select name="athlete_id">
              <option value="">Para todo el equipo</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </Select>
            <Input name="location" placeholder="Lugar" />
            <Textarea
              name="plan_items"
              placeholder={"Detalle de la sesión, una línea por ejercicio/tramo:\nSentadilla 4x10\nZancadas 3x12\n..."}
              rows={3}
              className="col-span-2 resize-y sm:col-span-3"
            />
            <Input
              name="description"
              placeholder="Notas"
              className="col-span-2 sm:col-span-2"
            />
            <Button type="submit" variant="primary" size="sm">
              Añadir
            </Button>
          </form>
        </details>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`${rajdhani.className} text-xl font-bold capitalize tracking-tight`}>
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-line text-sm font-medium">
            <Link
              href="/calendario?view=agenda"
              className={`rounded-l-lg px-3 py-1.5 ${view === "agenda" ? "bg-brand-strong text-white" : "text-ink-2 hover:bg-sunken"}`}
            >
              Agenda
            </Link>
            <Link
              href={`/calendario?view=mes${sp.d ? `&d=${sp.d}` : ""}`}
              className={`px-3 py-1.5 ${view === "mes" ? "bg-brand-strong text-white" : "text-ink-2 hover:bg-sunken"}`}
            >
              Mes
            </Link>
            <Link
              href={`/calendario?view=semana${sp.d ? `&d=${sp.d}` : ""}`}
              className={`rounded-r-lg px-3 py-1.5 ${view === "semana" ? "bg-brand-strong text-white" : "text-ink-2 hover:bg-sunken"}`}
            >
              Semana
            </Link>
          </div>
          {view !== "agenda" && (
            <>
              <Link href={prevHref} className="rounded-lg border border-line px-2.5 py-1.5 text-ink-2 hover:bg-sunken">
                ←
              </Link>
              <Link href={todayHref} className="rounded-lg border border-line px-2.5 py-1.5 text-sm font-medium text-ink-2 hover:bg-sunken">
                Hoy
              </Link>
              <Link href={nextHref} className="rounded-lg border border-line px-2.5 py-1.5 text-ink-2 hover:bg-sunken">
                →
              </Link>
            </>
          )}
        </div>
      </div>

      {view === "agenda" ? (
        <Agenda items={agendaItems} />
      ) : view === "mes" ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface p-2 sm:p-4">
          <div className="grid grid-cols-7 gap-px text-center text-xs text-ink-3">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="py-1.5">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-line text-sm">
            {monthDays.map((d) => {
              const key = ymd(d);
              const dayEvents = byDay.get(key) ?? [];
              const inMonth = d.getMonth() === monthStart.getMonth();
              const isToday = key === ymd(new Date());
              return (
                <div
                  key={key}
                  className={`min-h-[90px] bg-surface p-1.5 ${inMonth ? "" : "opacity-40"}`}
                >
                  <span
                    className={`text-xs ${isToday ? "rounded bg-brand-strong px-1 text-white" : "text-ink-3"}`}
                  >
                    {d.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((e) => (
                      <DayChip key={e.id} e={e} />
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-ink-3">+{dayEvents.length - 3} más</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
          {weekDays.map((d) => {
            const key = ymd(d);
            const dayEvents = byDay.get(key) ?? [];
            const isToday = key === ymd(new Date());
            return (
              <div
                key={key}
                className={`rounded-lg border p-3 ${isToday ? "border-brand/40 bg-brand-soft" : "border-line bg-surface"}`}
              >
                <p className="text-xs text-ink-3">
                  {d.toLocaleDateString("es-PE", { weekday: "short" })}{" "}
                  <span className="font-medium text-ink-2">{d.getDate()}</span>
                </p>
                <div className="mt-2 space-y-1.5">
                  {dayEvents.map((e) => (
                    <DayChip key={e.id} e={e} full />
                  ))}
                  {!dayEvents.length && <p className="text-xs text-ink-3/60">—</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {staff && (
        <details className="rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-medium text-ink-3">
            Borrar eventos
          </summary>
          <ul className="mt-3 space-y-2 text-sm">
            {(events as EventRow[] | null)?.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 border-t border-line pt-2 first:border-0 first:pt-0">
                <span className="text-ink-2">
                  {e.starts_at.slice(0, 10)} · {e.title}
                </span>
                <form action={delEvent}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="text-xs text-bad-text hover:underline">borrar</button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function DayChip({ e, full = false }: { e: EventRow; full?: boolean }) {
  const isRegatta = e.kind === "regatta";
  return (
    <Link
      href={`/calendario/${e.id}`}
      className={`block truncate rounded px-1.5 py-1 text-[11px] leading-tight transition hover:brightness-95 ${
        isRegatta ? "bg-brand-soft text-brand-text" : "bg-info-soft text-info-text"
      }`}
    >
      {!full && e.starts_at.slice(11, 16) + " "}
      {e.title}
      {e.plan_type && (
        <span className="ml-1 opacity-70">· {PLAN_LABEL[e.plan_type]}</span>
      )}
    </Link>
  );
}
