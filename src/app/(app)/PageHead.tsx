import { rajdhani } from "./fonts";

export default function PageHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-sm text-ink-3">{eyebrow}</p>}
      <h1
        className={`${rajdhani.className} text-2xl font-bold tracking-tight sm:text-3xl`}
      >
        {title}
      </h1>
      {subtitle && <p className="mt-1 max-w-xl text-sm text-ink-2">{subtitle}</p>}
    </div>
  );
}
