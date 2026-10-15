/**
 * Vídeos da demo (docs/06 §7). As URLs vêm do ambiente; sem URL, o slot mostra "em breve".
 * Com URL, o player só carrega ao clicar (click-to-load), sem JS nem cookies de terceiros antes.
 */

export type VideoSource =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "file"; src: string }
  | { kind: "link"; href: string };

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);
const FILE_PATTERN = /\.(mp4|webm|ogv)(\?.*)?$/i;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;

function youtubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") return url.pathname.slice(1) || null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const embed = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
  return embed?.[1] ?? null;
}

/** YouTube vira embed em youtube-nocookie.com; mp4/webm vira <video>; o resto vira link externo. */
export function parseVideoUrl(raw: string | undefined): VideoSource | null {
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  if (YOUTUBE_HOSTS.has(url.hostname)) {
    const id = youtubeId(url);
    if (id && YOUTUBE_ID.test(id)) {
      return {
        kind: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      };
    }
    return { kind: "link", href: url.toString() };
  }

  if (FILE_PATTERN.test(url.pathname)) return { kind: "file", src: url.toString() };
  return { kind: "link", href: url.toString() };
}
