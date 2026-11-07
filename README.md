# Anh-Van Vu — academic website

A responsive, static academic website for https://vanbk.github.io, with a research overview, news archive, publications, video demos, individual paper pages, a printable CV, and contact details.

## Develop and preview

Requires Node.js 20 or newer. No package installation is required.

```sh
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4173. The preview server listens only on the local machine. Run `npm run build` after editing the source, then refresh the browser. CSS and JavaScript URLs include content hashes, so rebuilding also refreshes their cache versions. Use `PORT` to select a different port.

## Edit content

- `data/profile.json`: biography, research overview, CV research profile, contact information, links, education, research areas, and update date.
- `data/publications.json`: one record per distinct work, including ordered authors, publication year, status, DOI, manuscript link, summary, and verification sources.
- `data/news.json`: dated updates and academic milestones. Use only the known date precision (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`); the homepage shows the latest three, and `/news/` shows the full archive.
- `data/demos.json`: YouTube video IDs, titles, descriptions, channel credits, and source links for `/demos/`. Use `showcase` for project videos and `media` for broadcast coverage.
- `scripts/build.mjs`: shared HTML templates, page introductions, and contact copy.
- `assets/css/site.css`: responsive profile layout, typography, and CV print styles.
- `assets/js/site.js`: publication search and filters, citation copying, and printing. Navigation stays visible without JavaScript.

Run `npm run build` and `npm run check` after changes. Commit the generated HTML, citation files, sitemap, and source together. All main content and links work without JavaScript; filters, copying, and the print button enhance the static pages.

The CV is at `/cv/`; its **Print / Save PDF** button uses the browser print dialog. There is no link to the missing legacy CV PDF. The original paper URLs and `/about/`, `/about.html`, and `/resume` redirect to their updated pages.

## GitHub Pages

GitHub Pages publishes the `master` branch from `/ (root)` at https://vanbk.github.io/ with HTTPS enabled. The generated site is served directly from the repository root. `.nojekyll` disables the old Jekyll build; Ruby, Bundler, and an npm build on GitHub are not required.

After editing, run `npm run check`, then commit and push the source and generated files together to `master`. GitHub automatically runs the `pages-build-deployment` workflow to publish the new version. The private review copy is separate from the public GitHub Pages deployment.

The old AcademicPages/Jekyll templates remain in the repository as historical source. They are not the active website. Edit the files listed above for future updates. The legacy `_config.yml` has also been corrected for identity, degree, timezone, and contact metadata.

## Content verification — 7 November 2026

The owner confirmed the **Ph.D. in Computer Science, KAIST, 2026** and prefers the title **Researcher**. The homepage displays **Researcher at ISILAB, KAIST**, with the affiliation checked against the lab's member page. The full lab name is **Intelligent Service Integration Lab**; no appointment title is inferred from the degree.

Google Scholar profile: https://scholar.google.com/citations?user=We1WRIYAAAAJ&hl=en

Direct automated access to the profile was rate-limited (HTTP 429). The six displayed works were cross-checked with primary sources; this is a curated update, not a claim of a complete Scholar synchronization. No citation totals or h-index were inferred. Per-publication source URLs are stored in `data/publications.json`.

- **2026:** Added the safety-management positioning preprint, submitted to arXiv on 15 October 2026. It is explicitly labeled **Preprint**. Source: https://arxiv.org/abs/2610.21503
- **2025:** Added the IEEE SMC black-box positioning paper. Its 2026 arXiv deposit is linked as the author manuscript, not counted as a second work. Sources: https://arxiv.org/abs/2610.21353 and https://doi.org/10.1109/SMC58881.2025.11342779
- **2024:** Corrected the SMC pedestrian dead reckoning paper's year from the old site's 2025 indexing date to the conference year, 2024. Source: https://pure.kaist.ac.kr/en/publications/real-time-pedestrian-dead-reckoning-for-iot-based-platform-indepe/
- **2022:** Corrected the IPIN paper's unrelated Springer link to DOI `10.1109/IPIN54987.2022.9918103`. Source: https://pure.kaist.ac.kr/en/publications/an-iot-based-approach-for-platform-independent-positioning-servic/
- **2020:** The PACLING 2019 proceedings chapter was published in 2020. Source: https://link.springer.com/chapter/10.1007/978-981-15-6168-9_12
- **2018:** Corrected the LoRa paper's author order using publisher-deposited Crossref metadata. Source: https://api.crossref.org/works/10.1109/ATC.2018.8587487

Research themes and the corrected KAIST email were also checked against the official ISILAB member page: https://sites.google.com/view/isilab/%ED%99%88/members . The avatar uses the owner-supplied research presentation photograph. Its source file is preserved, with desktop and mobile framing handled by CSS.

## Verification

`npm run check` rebuilds the site and validates generated pages, unique publication IDs and DOIs, local asset and PDF links, redirect destinations, HTML IDs, anchor targets, image alternatives, structured metadata, citation downloads, and the updated degree information. It also checks the four migrated news items, new page routes, video attribution, embeds, and direct YouTube links. It is a static/content check, not a visual browser or video playback test.

For visual review, check the homepage, news archive, video playback, publication filters, empty-search recovery, citation copying, navigation, paper details, and CV printing at desktop and phone widths. The site uses system fonts. Video players use YouTube's privacy-enhanced embedding domain, load lazily without autoplay, and retain a direct YouTube link. Playback depends on YouTube and each video's embedding permissions.

## Credits

The original website was based on AcademicPages, derived from Michael Rose's Minimal Mistakes theme. The original license is retained in `LICENSE`. The current design and static generator replace the active theme.

The previous design's DM Sans and Newsreader assets remain in `assets/fonts/` with their SIL Open Font License files. The current layout does not load them.
