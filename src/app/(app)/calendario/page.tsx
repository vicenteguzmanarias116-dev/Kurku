import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani } from "../fonts";
import PageHead from "../PageHead";
import CalendarMonth from "./CalendarMonth";
import type { EventLite } from "./EventDialog";

async function delEvent(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  await supabase.from("events").delete().eq("id", String(formData.get("id")));
  revalidatePath("/calendario");
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
  searchParams: Promise<{ d?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const staff = isStaff(profile);
  const sp = await searchParams;
  const anchor = sp.d && !Number.isNaN(Date.parse(sp.d)) ? new Date(sp.d) : new Date();

  const [{ data: events }, { data: athletes }] = await Promise.all([
    supabase.from("events").select("*").order("starts_at"),
    staff
      ? supabase.from("athletes").select("id, full_name").eq("active", true).order("full_name")
      : Promise.resolve({ data: null }),
  ]);
  const list: EventLite[] = (events ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    kind: e.kind,
    starts_at: e.starts_at,
    plan_type: e.plan_type,
    all_day: e.all_day ?? false,
    color: e.color ?? null,
  }));

  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = mondayOf(monthStart);
  const todayKey = ymd(new Date());
  const lastOfMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  const weeks = Math.ceil((((monthStart.getDay() + 6) % 7) + lastOfMonth.getDate()) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const d = addDays(gridStart, i);
    return {
      key: ymd(d),
      num: d.getDate(),
      inMonth: d.getMonth() === monthStart.getMonth(),
      isToday: ymd(d) === todayKey,
    };
  });

  const label = monthStart.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
  const navBtn =
    "rounded-lg border border-line px-2.5 py-1.5 text-ink-2 transition hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand-strong";

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Regatas · Entrenos" title="Calendario" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`${rajdhani.className} text-xl font-bold capitalize tracking-tight`}>{label}</h2>
          {staff && (
            <p className="text-xs text-ink-3">
              Haz click en un día, o arrastra sobre varios días, para crear un evento.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/calendario?d=${ymd(addMonths(monthStart, -1))}`} aria-label="Mes anterior" className={navBtn}>
            ←
          </Link>
          <Link href="/calendario" className={`${navBtn} text-sm font-medium`}>
            Hoy
          </Link>
          <Link href={`/calendario?d=${ymd(addMonths(monthStart, 1))}`} aria-label="Mes siguiente" className={navBtn}>
            →
          </Link>
        </div>
      </div>

      <CalendarMonth key={days.find((d) => d.inMonth)!.key} days={days} events={list} canCreate={staff} athletes={athletes ?? []} />

      {staff && (
        <details className="rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-medium text-ink-3">Borrar eventos</summary>
          <ul className="mt-3 space-y-2 text-sm">
            {list.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 border-t border-line pt-2 first:border-0 first:pt-0"
              >
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
