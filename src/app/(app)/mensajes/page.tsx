import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { mono, rajdhani } from "../fonts";
import PageHead from "../PageHead";
import Composer from "./Composer";

type Member = { id: string; full_name: string | null; role: string; avatar_url: string | null };
type Msg = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  coach: "Coach",
  fisico: "Preparador físico",
  nutricionista: "Nutricionista",
  athlete: "Atleta",
};

export default async function MensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ with?: string }>;
}) {
  const { supabase, user, profile } = await requireUser();
  const sp = await searchParams;

  const [{ data: members }, { data: messages }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url")
      .eq("team_id", profile!.team_id)
      .neq("id", user.id)
      .order("full_name"),
    supabase
      .from("direct_messages")
      .select("id, sender_id, recipient_id, body, created_at, read_at")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at"),
  ]);

  const byMember = new Map<string, Member>();
  for (const m of (members as Member[] | null) ?? []) byMember.set(m.id, m);

  // última fecha + no-leídos por contacto, a partir de los mensajes
  const lastAt = new Map<string, string>();
  const unread = new Map<string, number>();
  for (const m of (messages as Msg[] | null) ?? []) {
    const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
    lastAt.set(other, m.created_at);
    if (m.recipient_id === user.id && !m.read_at) {
      unread.set(other, (unread.get(other) ?? 0) + 1);
    }
  }

  const contacts = [...byMember.values()].sort((a, b) => {
    const la = lastAt.get(a.id) ?? "";
    const lb = lastAt.get(b.id) ?? "";
    return lb.localeCompare(la);
  });

  const activeId = sp.with && byMember.has(sp.with) ? sp.with : null;
  const active = activeId ? byMember.get(activeId)! : null;
  const thread = activeId
    ? ((messages as Msg[] | null) ?? []).filter(
        (m) => m.sender_id === activeId || m.recipient_id === activeId,
      )
    : [];

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Privado" title="Mensajes" subtitle="Conversaciones 1 a 1 con cualquiera de tu equipo." />

      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-[#0D141E]/80 sm:grid-cols-[220px_1fr]">
        <div className="divide-y divide-white/10 border-b border-white/10 sm:border-b-0 sm:border-r">
          {contacts.map((c) => {
            const n = unread.get(c.id) ?? 0;
            return (
              <Link
                key={c.id}
                href={`/mensajes?with=${c.id}`}
                className={`flex items-center gap-2 px-4 py-3 text-sm transition hover:bg-white/5 ${
                  activeId === c.id ? "bg-white/5" : ""
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-xs font-bold text-cyan-300">
                  {(c.full_name || "?").charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{c.full_name || "—"}</span>
                  <span className={`${mono.className} block text-[10px] uppercase tracking-wider text-white/30`}>
                    {ROLE_LABEL[c.role] ?? c.role}
                  </span>
                </span>
                {n > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5A36] px-1 text-[10px] font-bold text-[#05080D]">
                    {n}
                  </span>
                )}
              </Link>
            );
          })}
          {!contacts.length && (
            <p className="px-4 py-3 text-sm text-white/30">Tu equipo no tiene más miembros.</p>
          )}
        </div>

        <div className="flex min-h-[420px] flex-col">
          {!active ? (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-white/30">
              Elegí a alguien para empezar a escribirle.
            </div>
          ) : (
            <>
              <div className="border-b border-white/10 px-4 py-3">
                <p className={`${rajdhani.className} text-base font-bold`}>{active.full_name}</p>
                <p className={`${mono.className} text-[10px] uppercase tracking-wider text-white/30`}>
                  {ROLE_LABEL[active.role] ?? active.role}
                </p>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {thread.map((m) => {
                  const mine = m.sender_id === user.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          mine ? "bg-[#FF5A36] text-[#05080D]" : "bg-white/10 text-white/90"
                        }`}
                      >
                        {m.body}
                        <div
                          className={`${mono.className} mt-1 text-[9px] uppercase tracking-wider ${
                            mine ? "text-black/50" : "text-white/30"
                          }`}
                        >
                          {new Date(m.created_at).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!thread.length && (
                  <p className="text-sm text-white/30">Todavía no hay mensajes con {active.full_name}.</p>
                )}
              </div>

              <Composer recipientId={active.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
