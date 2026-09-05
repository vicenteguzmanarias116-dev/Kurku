import { rajdhani, mono } from "./fonts";

export default function PageHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-7">
      <span
        className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}
      >
        {eyebrow}
      </span>
      <h1
        className={`${rajdhani.className} mt-1 text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-xl text-sm text-white/50">{subtitle}</p>
      )}
    </div>
  );
}
