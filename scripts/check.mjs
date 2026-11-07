import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root, generatedFiles, publications, news, demos } from './build.mjs';

assert.equal(new Set(publications.map((p) => p.id)).size, publications.length, 'Publication IDs must be unique');
assert.equal(new Set(publications.map((p) => p.doi.toLowerCase())).size, publications.length, 'Do not double-count a conference paper and its arXiv deposit');
const paths = new Set();
let pages = 0;
for (const file of generatedFiles.filter((file) => file.endsWith('.html'))) {
  const html = await readFile(resolve(root, file), 'utf8');
  assert.match(html, /<html lang="en"/, `${file}: language required`);
  assert.match(html, /name="viewport"/, `${file}: responsive viewport required`);
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: title required`);
  assert.match(html, /rel="canonical"/, `${file}: canonical required`);
  if (!html.includes('http-equiv="refresh"')) {
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file}: exactly one h1`);
    assert.match(html, /id="main"/, `${file}: main target required`);
    for (const script of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(script[1]);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate HTML IDs`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith('/') && !target.startsWith('//')) {
      const path = target.split(/[?#]/)[0];
      paths.add(path);
      const filename = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
      assert.ok((await stat(filename)).isFile(), `${file}: missing target ${target}`);
      const hash = target.split('#')[1];
      if (hash) assert.match(await readFile(filename, 'utf8'), new RegExp(`id="${hash}"`), `${file}: missing fragment ${target}`);
    } else if (target.startsWith('#')) {
      assert.ok(ids.includes(target.slice(1)), `${file}: missing anchor ${target}`);
    }
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /alt="[^"]+"/, `${file}: missing alt text`);
  for (const link of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(link[0], /rel="noopener noreferrer"/, `${file}: external link safety`);
  pages += 1;
}
const css = await readFile(resolve(root, 'assets/css/site.css'), 'utf8');
for (const match of css.matchAll(/url\("(\/[^"?#]+)"\)/g)) assert.ok((await stat(resolve(root, '.' + match[1]))).isFile(), `Missing CSS asset ${match[1]}`);
for (const p of publications) {
  assert.ok(['conference', 'preprint'].includes(p.type));
  assert.ok(p.sources?.length, `${p.id}: source URL required`);
  assert.ok(p.year >= 2018 && p.year <= 2026, `${p.id}: unexpected year`);
  assert.ok(p.doi.startsWith('10.'), `${p.id}: invalid DOI`);
  assert.match(await readFile(resolve(root, `files/${p.id}.bib`), 'utf8'), new RegExp(`year = \\{${p.year}\\}`));
}
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const cv = await readFile(resolve(root, 'cv/index.html'), 'utf8');
const newsHTML = await readFile(resolve(root, 'news/index.html'), 'utf8');
const demosHTML = await readFile(resolve(root, 'demos/index.html'), 'utf8');
assert.equal(new Set(news.map((item) => item.id)).size, news.length, 'News IDs must be unique');
assert.deepEqual(news.filter((item) => item.origin === 'legacy').map((item) => item.date).sort(), ['2018-03', '2020-08', '2020-09', '2022-07'], 'Retain all four dated updates from the original website');
assert.ok(news.filter((item) => item.origin === 'update').length >= 3, 'Include new research and academic updates');
for (const item of news) {
  assert.match(item.date, /^\d{4}(?:-\d{2})?(?:-\d{2})?$/, 'Preserve the known date precision');
  assert.ok(item.sources?.length, `${item.id}: news provenance required`);
  assert.ok(newsHTML.includes(`id="${item.id}"`), `${item.id}: missing from the news archive`);
}
for (const id of ['coQhDIvFYQk', 'fnU3htLUhV8']) assert.ok(newsHTML.includes(id), 'Retain the original broadcast links');
assert.equal(new Set(demos.map((video) => video.youtubeId)).size, demos.length, 'Do not duplicate videos');
assert.ok(demos.some((video) => video.youtubeId === 'Cxpu_CSS8kU'), 'Include the requested video');
for (const video of demos) {
  assert.match(video.youtubeId, /^[A-Za-z0-9_-]{11}$/, 'YouTube video ID required');
  assert.ok(video.channel && video.channelUrl && video.sources?.length, 'Video attribution required');
  assert.ok(demosHTML.includes(`https://www.youtube.com/watch?v=${video.youtubeId}`), 'Provide a direct viewing link');
}
const videoFrames = [...demosHTML.matchAll(/<iframe\b[^>]*>/g)].map((match) => match[0]);
assert.equal(videoFrames.length, demos.length, 'Every video must have an embedded player');
for (const frame of videoFrames) {
  assert.match(frame, /title="[^"]+"/, 'Accessible player title required');
  assert.match(frame, /loading="lazy"/, 'Load video players lazily');
  assert.match(frame, /referrerpolicy="strict-origin-when-cross-origin"/, 'YouTube requires an appropriate referrer');
  assert.doesNotMatch(frame, /autoplay=1/, 'Do not play videos automatically');
}
for (const route of ['/news/', '/demos/']) {
  assert.ok(home.includes(`href="${route}"`), `${route}: navigation link required`);
  assert.ok((await readFile(resolve(root, 'sitemap.xml'), 'utf8')).includes(route), `${route}: sitemap entry required`);
}
assert.match(home, /Ph\.D\. in Computer Science/);
assert.match(home, /KAIST, 2026/);
assert.match(cv, /2026/);
assert.doesNotMatch(cv, /GitHub University|Version Control Theory|expected/);
assert.equal(publications.find((p) => p.id === 'vu2025blackbox').year, 2025);
assert.equal(publications.find((p) => p.id === 'vu2026safety').type, 'preprint');
assert.equal(publications.find((p) => p.id === 'vu2024pdr').year, 2024);
assert.equal(publications.find((p) => p.id === 'vu2022iot').doi, '10.1109/IPIN54987.2022.9918103');
await stat(resolve(root, '.nojekyll'));
console.log(`PASS: ${pages} HTML pages; ${paths.size} local targets; ${publications.length} unique publications; ${news.length} news entries; ${demos.length} video embeds; metadata, citations, assets, legacy links, and Ph.D. content.`);
