import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { rajdhani } from "./fonts";

// ─── Layout ──────────────────────────────────────────────────────────────

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[14px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,40,.06),0_1px_3px_rgba(16,24,40,.1)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className={`${rajdhani.className} text-lg font-bold text-ink`}>
          {title}
        </h2>
        {hint && <p className="mt-0.5 text-sm text-ink-3">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-3">
      <h2 className={`${rajdhani.className} text-lg font-bold text-ink`}>
        {children}
      </h2>
      {hint && <p className="mt-0.5 text-sm text-ink-3">{hint}</p>}
    </div>
  );
}

// ─── Botones ─────────────────────────────────────────────────────────────

const BTN_VARIANT = {
  primary: "bg-brand-strong text-white hover:bg-brand",
  secondary: "border border-line bg-surface text-ink-2 hover:bg-sunken hover:text-ink",
  ghost: "text-ink-2 hover:bg-sunken hover:text-ink",
  danger: "bg-bad text-white hover:bg-bad-text",
} as const;

const BTN_SIZE = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
} as const;

type BtnVariant = keyof typeof BTN_VARIANT;
type BtnSize = keyof typeof BTN_SIZE;

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: BtnSize;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition disabled:opacity-50 ${BTN_VARIANT[variant]} ${BTN_SIZE[size]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "secondary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition ${BTN_VARIANT[variant]} ${BTN_SIZE[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

// ─── Formulario ──────────────────────────────────────────────────────────

const FIELD_BASE =
  "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block text-xs font-medium text-ink-2">{label}</span>}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-bad-text">{error}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${FIELD_BASE} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${FIELD_BASE} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${FIELD_BASE} ${props.className ?? ""}`} />;
}

// ─── Estado ──────────────────────────────────────────────────────────────

const BADGE_TONE = {
  neutral: "bg-sunken text-ink-2",
  brand: "bg-brand-soft text-brand-text",
  ok: "bg-ok-soft text-ok-text",
  warn: "bg-warn-soft text-warn-text",
  bad: "bg-bad-soft text-bad-text",
  info: "bg-info-soft text-info-text",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof BADGE_TONE;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_TONE[tone]}`}
    >
      {children}
    </span>
  );
}

export function Empty({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-ink-2">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-3">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Navegación secundaria ───────────────────────────────────────────────

export function Tabs({
  items,
}: {
  items: { label: string; href: string; active: boolean }[];
}) {
  return (
    <div className="flex gap-1 border-b border-line">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`px-3 py-2 text-sm font-medium transition ${
            t.active
              ? "border-b-2 border-brand-strong text-ink"
              : "text-ink-3 hover:text-ink"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
