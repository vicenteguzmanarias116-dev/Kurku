import Link from "next/link";
import { requireUser, isStaff } from "@/lib/auth";
import { signOut } from "./actions";

const NAV = [
  { href: "/dashboard", label: "Panel" },
  { href: "/atletas", label: "Atletas" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/calendario", label: "Calendario" },
  { href: "/comunicacion", label: "Comunicación" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireUser();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-6 border-b border-zinc-200 px-6 py-3">
        <span className="font-semibold">Kurku</span>
        <nav className="flex gap-4 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:underline">
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="ml-auto">
          <span className="mr-3 text-sm text-zinc-500">
            {profile?.full_name ?? ""}
            {isStaff(profile) ? " · staff" : ""}
          </span>
          <button className="text-sm text-zinc-600 hover:underline">
            Salir
          </button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
