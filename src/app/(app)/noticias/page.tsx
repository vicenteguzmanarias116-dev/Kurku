import { rajdhani, mono } from "../fonts";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

const FEED_URL =
  "https://news.google.com/rss/search?q=vela%20regata%20velero&hl=es-419&gl=PE&ceid=PE:es-419";

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
}

function tag(block: string, name: string) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decodeEntities(m[1]).trim() : "";
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 1800 }, // 30 min, no golpear el feed en cada visita
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    return items.slice(0, 15).map((block) => ({
      title: tag(block, "title"),
      link: tag(block, "link"),
      pubDate: tag(block, "pubDate"),
      source: tag(block, "source"),
    }));
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function NoticiasPage() {
  const news = await getNews();

  return (
    <div className="space-y-6">
      <div>
        <h2
          className={`${rajdhani.className} text-2xl font-bold uppercase tracking-tight`}
        >
          Noticias de vela
        </h2>
        <p className="mt-1 text-sm text-white/40">
          Lo último del mundo de la vela, actualizado cada 30 minutos.
        </p>
      </div>

      <div className="cut-corner border border-cyan-400/20 bg-[#0D141E] p-6">
        {news.length === 0 ? (
          <p className="text-sm text-white/30">
            No se pudo cargar el feed de noticias en este momento.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {news.map((n) => (
              <li key={n.link} className="py-3 first:pt-0 last:pb-0">
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/90 transition hover:text-cyan-300"
                >
                  {n.title}
                </a>
                <p
                  className={`${mono.className} mt-1 text-[11px] uppercase tracking-wider text-white/30`}
                >
                  {n.source}
                  {n.source && n.pubDate ? " · " : ""}
                  {formatDate(n.pubDate)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
