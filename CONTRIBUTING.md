# Contributing & Authoring Guide

This blog is built with [Eleventy (11ty)](https://www.11ty.dev/) — a fast,
JavaScript-based static site generator. This guide covers how to run it locally,
write a new post, and how the site is organized.

> **Branch note:** all 11ty source lives on the **`eleventy`** branch of the
> `shekharkoirala.github.io` repo. The `master` branch still holds the old
> Hugo-built HTML (the currently-live site). Do your work on `eleventy`.

---

## 1. Prerequisites

- **Node.js 18+** (the repo is developed on Node 24). Check with `node -v`.
- npm (ships with Node).

## 2. Run it locally

```bash
# from the repo root
npm install          # first time only — installs Eleventy + plugins
npm start            # starts the dev server with live reload
```

Then open **http://localhost:8080/**. The server watches files and rebuilds
automatically when you edit content, templates, or CSS.

To produce a one-off production build into `_site/` (this is what gets deployed):

```bash
npm run build
```

> `npm run build` sets production mode, which **excludes drafts**
> (`draft: true` posts). `npm start` includes drafts so you can preview them.

---

## 3. Write a new post

1. Create a markdown file in `content/blog/`, e.g.
   `content/blog/my_new_post.md`. The filename becomes the URL slug
   (`/blog/my_new_post/`).

2. Add front matter at the top:

   ```markdown
   ---
   title: "My Great New Post"
   date: 2026-06-10
   description: "A one-line summary shown in listings and meta tags."
   tags:
     - python
     - tutorial
   categories:
     - ML          # see category groups below
   author: shekhar
   cover: /images/my-cover.jpg   # optional hero image
   ---

   Your **markdown** content goes here. Code blocks, images, links all work:

   ## A heading

   ```python
   print("hello world")
   ```

   ![alt text](/images/some-image.png)

   [a link](https://example.com)
   ```

3. **Images** go in `public/images/`. Reference them with an absolute path:
   `/images/your-file.png`. They are copied to the site root as-is.

4. **Drafts:** add `draft: true` to the front matter. Drafts show in `npm start`
   but are excluded from `npm run build` (production).

That's it — save the file and it appears in the local preview immediately.

---

## 4. How categories & tags work

There are **two levels** of organization:

- **Tags** — granular, free-form (e.g. `python`, `cuda`, `prefect`). Use as
  many as you like. Each gets a page at `/tags/<tag>/` and they're listed at
  `/tags/`. Tag matching is case-insensitive.

- **Category groups** — the 4 high-level buckets shown in the sidebar:
  **AI & Data**, **Engineering**, **Photography**, **Life**.

You **don't** set the group directly. Instead you put a granular category in
front matter (`categories: [ML]`, `[aws]`, `[photography]`, …) and it is mapped
to one of the 4 groups automatically. The mapping lives in
**`_data/categoryGroups.js`**:

```js
export const order = ["AI & Data", "Engineering", "Photography", "Life"];
export const map = {
  "ml": "AI & Data",
  "aws": "Engineering",
  "photography": "Photography",
  "random": "Life",
  // ...add new granular categories here
};
```

- A post's **primary group** = the group of its **first** mapped category.
- To add a new granular category, add a line to `map`. Unmapped categories fall
  back to the group **"Other"**.
- To add/rename/reorder the top-level groups, edit `order` and `map`.

The sidebar's hover-to-filter on the home page filters by these groups.

---

## 4b. Theme colors & light/dark mode

The site ships a **dark** (default) and **light** theme using this palette:
`#2C3930` `#3F4F44` `#A27B5C` `#DCD7C9`. A toggle lives at the bottom of the
sidebar; the choice is saved to `localStorage` and applied before first paint
(no flash). All colors are CSS variables defined at the top of `css/index.css`
under `[data-theme="dark"]` / `[data-theme="light"]` — edit there to retune.

## 4c. The CV / About page

`/about/` is a **two-page CV** rendered in HTML using the **Computer Modern**
(LaTeX) web font — see `content/about.md`. The **Download PDF** button calls
`window.print()`, and a print stylesheet (`@media print` in `css/index.css`)
outputs *only* the two CV pages at true A4 size, so the browser's "Save as PDF"
produces a clean, font-embedded, two-page PDF.

- Edit the CV content directly in `content/about.md` (plain HTML).
- The matching **LaTeX source** is `cv/shekhar_cv.tex` — keep it in sync. To
  produce a "real" LaTeX PDF, compile it (`pdflatex cv/shekhar_cv.tex`, or paste
  into [Overleaf](https://overleaf.com)).
- The Computer Modern font files live in `public/fonts/` (served from `/fonts/`).

## 5. Project structure

```
content/                 # all pages & posts (this is the site input)
  index.njk              # home page (post list + hover filter)
  blog.njk               # /blog/ paginated archive (8 per page)
  about.md               # /about/
  tags.njk               # /tags/ index
  tag-pages.njk          # generates each /tags/<tag>/ page
  category-pages.njk     # generates each /categories/<group>/ page
  blog/                  # the markdown posts
    blog.11tydata.js     # shared post settings + categoryGroup logic
_includes/
  layouts/base.njk       # sidebar + page shell
  layouts/post.njk       # single-post layout
_data/
  metadata.js            # site title, description, author
  categoryGroups.js      # category -> group mapping
css/index.css            # all styles (dark theme + sidebar)
public/images/           # images, copied to /images/ in the output
scripts/                 # one-off migration helpers (not needed for authoring)
eleventy.config.js       # Eleventy configuration & custom collections
```

---

## 6. Deploying (when ready)

The site builds to `_site/`. Deployment of the new 11ty site is **not wired up
yet** — the live site still serves the old Hugo output from `master`. When you
decide to cut over, options are:

- Point the host (Netlify / GitHub Pages) at a build of the `eleventy` branch
  (`npm run build`, publish `_site/`), or
- Build locally and push `_site/` to the deploy branch.

Until then, everything here is local-only.
