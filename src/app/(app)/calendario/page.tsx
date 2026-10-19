import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani } from "../fonts";
import PageHead from "../PageHead";
import { Card, Field, Input, Select, Textarea, Button, LinkButton } from "../ui";
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
    starts_at: new Date(String(formData.get("starts_at")) + "Z").toISOString(),
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
  const back = String(formData.get("back") || "");
  redirect(back.startsWith("/calendario") ? back : "/calendario");
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
  searchParams: Promise<{ d?: string; new?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const staff = isStaff(profile);
  const sp = await searchParams;
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

  const baseHref = sp.d ? `/calendario?d=${sp.d}` : "/calendario";
  const newHref = (day: string) => `${baseHref}${sp.d ? "&" : "?"}new=${day}`;
  const newDate = staff && sp.new && /^\d{4}-\d{2}-\d{2}$/.test(sp.new) ? sp.new : null;

  const monthStart = startOfMonth(anchor);
  const gridStart = mondayOf(monthStart);
  const monthDays = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const prevHref = `/calendario?d=${ymd(addMonths(monthStart, -1))}`;
  const nextHref = `/calendario?d=${ymd(addMonths(monthStart, 1))}`;
  const label = monthStart.toLocaleDateString("es-PE", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Regatas · Entrenos" title="Calendario" />

      {newDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Link href={baseHref} aria-label="Cerrar" className="absolute inset-0 bg-ink/40" />
          <Card className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className={`${rajdhani.className} text-xl font-bold`}>Nuevo evento</h2>
                <p className="text-sm capitalize text-ink-3">
                  {new Date(newDate + "T12:00:00").toLocaleDateString("es-PE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Link href={baseHref} aria-label="Cerrar" className="text-ink-3 hover:text-ink">
                ✕
              </Link>
            </div>
            <form action={addEvent} className="space-y-3 text-sm">
              <input type="hidden" name="back" value={baseHref} />
              <Input name="title" placeholder="Añade un título" required autoFocus />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha y hora">
                  <Input name="starts_at" type="datetime-local" defaultValue={`${newDate}T09:00`} required />
                </Field>
                <Field label="Tipo">
                  <Select name="kind">
                    <option value="training">Entrenamiento</option>
                    <option value="regatta">Regata</option>
                    <option value="other">Otro</option>
                  </Select>
                </Field>
                <Field label="Tipo de plan">
                  <Select name="plan_type">
                    <option value="">Ninguno</option>
                    {PLAN_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.emoji} {p.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Para">
                  <Select name="athlete_id">
                    <option value="">Todo el equipo</option>
                    {athletes?.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.full_name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Input name="location" placeholder="Lugar" />
              <Textarea
                name="plan_items"
                placeholder={"Detalle de la sesión, una línea por ejercicio/tramo:\nSentadilla 4x10\nZancadas 3x12"}
                rows={3}
                className="resize-y"
              />
              <Input name="description" placeholder="Notas" />
              <div className="flex justify-end gap-2 pt-1">
                <LinkButton href={baseHref} variant="ghost">
                  Cancelar
                </LinkButton>
                <Button type="submit" variant="primary">
                  Guardar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={`${rajdhani.className} text-xl font-bold capitalize tracking-tight`}>
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <Link href={prevHref} className="rounded-lg border border-line px-2.5 py-1.5 text-ink-2 hover:bg-sunken">
            ←
          </Link>
          <Link href="/calendario" className="rounded-lg border border-line px-2.5 py-1.5 text-sm font-medium text-ink-2 hover:bg-sunken">
            Hoy
          </Link>
          <Link href={nextHref} className="rounded-lg border border-line px-2.5 py-1.5 text-ink-2 hover:bg-sunken">
            →
          </Link>
        </div>
      </div>

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
                className={`relative min-h-[90px] bg-surface p-1.5 sm:min-h-[110px] ${staff ? "hover:bg-sunken" : ""} ${inMonth ? "" : "opacity-40"}`}
              >
                {staff && (
                  <Link href={newHref(key)} aria-label={`Crear evento el ${key}`} className="absolute inset-0" />
                )}
                <span
                  className={`pointer-events-none relative text-xs ${isToday ? "rounded bg-brand-strong px-1 text-white" : "text-ink-3"}`}
                >
                  {d.getDate()}
                </span>
                <div className="pointer-events-none relative mt-1 space-y-1">
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

function DayChip({ e }: { e: EventRow }) {
  const isRegatta = e.kind === "regatta";
  return (
    <Link
      href={`/calendario/${e.id}`}
      className={`pointer-events-auto relative block truncate rounded px-1.5 py-1 text-[11px] leading-tight transition hover:brightness-95 ${
        isRegatta ? "bg-brand-soft text-brand-text" : "bg-info-soft text-info-text"
      }`}
    >
      {e.starts_at.slice(11, 16) + " "}
      {e.title}
      {e.plan_type && (
        <span className="ml-1 opacity-70">· {PLAN_LABEL[e.plan_type]}</span>
      )}
    </Link>
  );
}
