import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani, mono } from "../fonts";
import PageHead from "../PageHead";

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

const input =
  "border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40";

const PLAN_LABEL: Record<string, string> = {
  gym: "Gym",
  bike: "Bici",
  sailing: "Vela",
  other: "Otro",
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
  const view = sp.view === "semana" ? "semana" : "mes";
  const anchor = sp.d && !Number.isNaN(Date.parse(sp.d)) ? new Date(sp.d) : new Date();

  const [{ data: events }, { data: athletes }] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, kind, title, starts_at, location, description, athlete_id, plan_type, athletes(full_name)",
      )
      .order("starts_at"),
    staff
      ? supabase.from("athletes").select("id, full_name").eq("active", true).order("full_name")
      : Promise.resolve({ data: null }),
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
    view === "semana"
      ? `${weekDays[0].toLocaleDateString("es-PE", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}`
      : monthStart.toLocaleDateString("es-PE", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Regatas · Entrenos" title="Calendario" />

      {staff && (
        <details className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-5">
          <summary
            className={`${mono.className} cursor-pointer text-xs uppercase tracking-wider text-cyan-300`}
          >
            Añadir evento / plan
          </summary>
          <form
            action={addEvent}
            className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3"
          >
            <input name="title" placeholder="Título" required className={input} />
            <input name="starts_at" type="datetime-local" required className={input} />
            <select name="kind" className={input}>
              <option value="training">Entrenamiento</option>
              <option value="regatta">Regata</option>
              <option value="other">Otro</option>
            </select>
            <select name="plan_type" className={input}>
              <option value="">Tipo de plan (opcional)</option>
              <option value="gym">Gym</option>
              <option value="bike">Bici</option>
              <option value="sailing">Vela</option>
              <option value="other">Otro</option>
            </select>
            <select name="athlete_id" className={input}>
              <option value="">Para todo el equipo</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </select>
            <input name="location" placeholder="Lugar" className={input} />
            <textarea
              name="plan_items"
              placeholder={"Detalle de la sesión, una línea por ejercicio/tramo:\nSentadilla 4x10\nZancadas 3x12\n..."}
              rows={3}
              className={`${input} col-span-2 resize-y sm:col-span-3`}
            />
            <input
              name="description"
              placeholder="Notas"
              className={`${input} col-span-2 sm:col-span-2`}
            />
            <button className="cut-corner bg-[#FF5A36] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
              Añadir
            </button>
          </form>
        </details>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`${rajdhani.className} text-xl font-bold capitalize tracking-tight`}>
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <div className={`${mono.className} flex border border-white/15 text-xs uppercase tracking-wide`}>
            <Link
              href={`/calendario?view=mes${sp.d ? `&d=${sp.d}` : ""}`}
              className={`px-3 py-1.5 ${view === "mes" ? "bg-[#FF5A36] text-[#05080D]" : "text-white/50 hover:text-white"}`}
            >
              Mes
            </Link>
            <Link
              href={`/calendario?view=semana${sp.d ? `&d=${sp.d}` : ""}`}
              className={`px-3 py-1.5 ${view === "semana" ? "bg-[#FF5A36] text-[#05080D]" : "text-white/50 hover:text-white"}`}
            >
              Semana
            </Link>
          </div>
          <Link href={prevHref} className="border border-white/15 px-2.5 py-1.5 text-white/60 hover:text-white">
            ←
          </Link>
          <Link href={todayHref} className={`${mono.className} border border-white/15 px-2.5 py-1.5 text-xs uppercase tracking-wide text-white/60 hover:text-white`}>
            Hoy
          </Link>
          <Link href={nextHref} className="border border-white/15 px-2.5 py-1.5 text-white/60 hover:text-white">
            →
          </Link>
        </div>
      </div>

      {view === "mes" ? (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0D141E]/80 p-2 sm:p-4">
          <div className={`${mono.className} grid grid-cols-7 gap-px text-center text-[10px] uppercase tracking-wider text-white/30`}>
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="py-1.5">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-white/5 text-sm">
            {monthDays.map((d) => {
              const key = ymd(d);
              const dayEvents = byDay.get(key) ?? [];
              const inMonth = d.getMonth() === monthStart.getMonth();
              const isToday = key === ymd(new Date());
              return (
                <div
                  key={key}
                  className={`min-h-[90px] bg-[#0D141E] p-1.5 ${inMonth ? "" : "opacity-30"}`}
                >
                  <span
                    className={`${mono.className} text-[11px] ${isToday ? "bg-[#FF5A36] px-1 text-[#05080D]" : "text-white/40"}`}
                  >
                    {d.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((e) => (
                      <DayChip key={e.id} e={e} />
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-white/30">+{dayEvents.length - 3} más</p>
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
                className={`rounded-lg border p-3 ${isToday ? "border-[#FF5A36]/40 bg-[#FF5A36]/[0.04]" : "border-white/10 bg-[#0D141E]/80"}`}
              >
                <p className={`${mono.className} text-[11px] uppercase tracking-wider text-white/40`}>
                  {d.toLocaleDateString("es-PE", { weekday: "short" })}{" "}
                  <span className="text-white/70">{d.getDate()}</span>
                </p>
                <div className="mt-2 space-y-1.5">
                  {dayEvents.map((e) => (
                    <DayChip key={e.id} e={e} full />
                  ))}
                  {!dayEvents.length && <p className="text-xs text-white/20">—</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {staff && (
        <details className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-5">
          <summary className={`${mono.className} cursor-pointer text-xs uppercase tracking-wider text-white/40`}>
            Borrar eventos
          </summary>
          <ul className="mt-3 space-y-2 text-sm">
            {(events as EventRow[] | null)?.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2 first:border-0 first:pt-0">
                <span className="text-white/60">
                  {e.starts_at.slice(0, 10)} · {e.title}
                </span>
                <form action={delEvent}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="text-xs text-red-400 hover:underline">borrar</button>
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
      className={`block truncate rounded px-1.5 py-1 text-[11px] leading-tight transition hover:brightness-125 ${
        isRegatta
          ? "bg-[#FF5A36]/20 text-[#FF5A36]"
          : "bg-cyan-400/10 text-cyan-200"
      }`}
    >
      {!full && e.starts_at.slice(11, 16) + " "}
      {e.title}
      {e.plan_type && (
        <span className="ml-1 opacity-60">· {PLAN_LABEL[e.plan_type]}</span>
      )}
    </Link>
  );
}
