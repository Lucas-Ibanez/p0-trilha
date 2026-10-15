import assert from "node:assert/strict";
import { test } from "node:test";
import { parseVideoUrl } from "./demo.ts";

test("sem URL ou URL inválida: nada (estado 'em breve')", () => {
  assert.equal(parseVideoUrl(undefined), null);
  assert.equal(parseVideoUrl(""), null);
  assert.equal(parseVideoUrl("não é url"), null);
});

test("só HTTPS: http e outros protocolos são recusados", () => {
  assert.equal(parseVideoUrl("http://www.youtube.com/watch?v=aqz-KE-bpKQ"), null);
  assert.equal(parseVideoUrl("javascript:alert(1)"), null);
  assert.equal(parseVideoUrl("data:text/html,x"), null);
});

test("YouTube vira embed em youtube-nocookie.com, em todas as formas de URL", () => {
  const expected = {
    kind: "youtube",
    embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0",
  };
  assert.deepEqual(parseVideoUrl("https://www.youtube.com/watch?v=aqz-KE-bpKQ"), expected);
  assert.deepEqual(parseVideoUrl("https://youtu.be/aqz-KE-bpKQ"), expected);
  assert.deepEqual(parseVideoUrl("https://www.youtube.com/embed/aqz-KE-bpKQ"), expected);
  assert.deepEqual(parseVideoUrl("https://m.youtube.com/shorts/aqz-KE-bpKQ"), expected);
});

test("id de YouTube malformado cai em link externo, nunca em embed", () => {
  const result = parseVideoUrl('https://www.youtube.com/watch?v="><script>');
  assert.equal(result?.kind, "link");
});

test("arquivos mp4/webm viram <video>; o resto vira link", () => {
  assert.deepEqual(parseVideoUrl("https://cdn.example.com/demo.mp4"), {
    kind: "file",
    src: "https://cdn.example.com/demo.mp4",
  });
  assert.equal(parseVideoUrl("https://cdn.example.com/demo.webm?x=1")?.kind, "file");
  assert.deepEqual(parseVideoUrl("https://vimeo.com/123456"), {
    kind: "link",
    href: "https://vimeo.com/123456",
  });
});
