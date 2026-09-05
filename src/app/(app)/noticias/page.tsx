import { rajdhani, mono } from "../fonts";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  isDinghy: boolean;
  image: string | null;
};

const GENERAL_FEED =
  "https://news.google.com/rss/search?q=vela%20regata%20velero&hl=es-419&gl=PE&ceid=PE:es-419";
// clases dinghy: botes chicos, un timonel, sin quilla fija (ILCA/Laser, Optimist, 420, 470, Snipe...)
const DINGHY_FEED =
  "https://news.google.com/rss/search?q=ILCA%20OR%20Laser%20OR%20Optimist%20OR%20Snipe%20OR%20%22420%22%20vela%20regata&hl=es-419&gl=PE&ceid=PE:es-419";

const DINGHY_KEYWORDS =
  /\b(ilca|l[aá]ser|optimist|snipe|420|470|cadete|dinghy|dingui)\b/i;

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

async function fetchFeed(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // 30 min, no golpear el feed en cada visita
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    return blocks.map((block) => {
      const title = tag(block, "title");
      return {
        title,
        link: tag(block, "link"),
        pubDate: tag(block, "pubDate"),
        source: tag(block, "source"),
        isDinghy: DINGHY_KEYWORDS.test(title),
        image: null as string | null,
      };
    });
  } catch {
    return [];
  }
}

/** Portada del artículo (og:image); null si no se pudo sacar a tiempo. */
async function fetchCover(link: string): Promise<string | null> {
  try {
    const res = await fetch(link, {
      redirect: "follow",
      signal: AbortSignal.timeout(3000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

async function getNews(): Promise<NewsItem[]> {
  const [general, dinghy] = await Promise.all([
    fetchFeed(GENERAL_FEED),
    fetchFeed(DINGHY_FEED),
  ]);

  const byLink = new Map<string, NewsItem>();
  for (const item of [...dinghy, ...general]) {
    // dinghy primero: si un link se repite en ambos feeds, gana la marca dinghy
    const existing = byLink.get(item.link);
    if (!existing) byLink.set(item.link, item);
    else if (item.isDinghy) existing.isDinghy = true;
  }

  const items = [...byLink.values()]
    .sort((a, b) => {
      if (a.isDinghy !== b.isDinghy) return a.isDinghy ? -1 : 1;
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    })
    .slice(0, 18);

  const covers = await Promise.all(items.map((n) => fetchCover(n.link)));
  items.forEach((n, i) => (n.image = covers[i]));

  return items;
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
          Lo último del mundo de la vela, actualizado cada 30 minutos. Las
          noticias de dinghies (ILCA, Optimist, 420...) van primero.
        </p>
      </div>

      {news.length === 0 ? (
        <div className="cut-corner border border-cyan-400/20 bg-[#0D141E] p-6">
          <p className="text-sm text-white/30">
            No se pudo cargar el feed de noticias en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {news.map((n) => (
            <a
              key={n.link}
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`cut-corner group flex flex-col overflow-hidden border bg-[#0D141E] transition hover:border-cyan-300/50 ${
                n.isDinghy ? "border-[#FF5A36]/50" : "border-white/10"
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                {n.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/15">
                    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="M12 2v14" />
                      <path d="M12 4l7 9h-7z" />
                      <path d="M6 16h12l-1.6 4H7.6z" />
                    </svg>
                  </div>
                )}
                {n.isDinghy && (
                  <span
                    className={`${mono.className} absolute left-2 top-2 bg-[#FF5A36] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#05080D]`}
                  >
                    Dinghy
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-3 text-sm text-white/90 group-hover:text-cyan-300">
                  {n.title}
                </p>
                <p
                  className={`${mono.className} mt-auto pt-3 text-[11px] uppercase tracking-wider text-white/30`}
                >
                  {n.source}
                  {n.source && n.pubDate ? " · " : ""}
                  {formatDate(n.pubDate)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
