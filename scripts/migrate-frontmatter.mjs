#!/usr/bin/env node
// Migrates Hugo front matter in .md files to 11ty-compatible front matter.
// Usage: node scripts/migrate-frontmatter.mjs <srcDir> <destDir>

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const HUGO_DROP_KEYS = new Set([
  "authorLink", "license", "hidefooter", "hiddenFromHomePage", "hiddenFromSearch",
  "twemoji", "lightgallery", "ruby", "fraction", "fontawesome", "linkToMarkdown",
  "rssFullText", "toc", "ShowBreadCrumbs", "ShowPostNavLinks", "searchHidden",
  "showtoc", "subtitle", "featuredImagePreview", "images",
  "disableShare", "hideMeta", "ShowMeta", "comments",
]);

function dedupeYamlKeys(yamlStr) {
  // Remove duplicate keys (keep first occurrence)
  const seen = new Set();
  return yamlStr.split("\n").filter(line => {
    const keyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):/);
    if (!keyMatch) return true;
    const key = keyMatch[1];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join("\n");
}

function migrateFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return raw;

  const [, rawYaml, body] = match;
  const cleanYaml = dedupeYamlKeys(rawYaml);

  let fm;
  try {
    fm = parseYaml(cleanYaml) || {};
  } catch (e) {
    console.error("YAML parse failed:", e.message);
    return raw;
  }

  const out = {};

  if (fm.title) out.title = fm.title;
  if (fm.date) out.date = fm.date;
  if (fm.description) out.description = fm.description;
  if (fm.tags) out.tags = Array.isArray(fm.tags) ? fm.tags : [fm.tags];
  if (fm.categories) out.categories = Array.isArray(fm.categories) ? fm.categories : [fm.categories];
  if (fm.series) out.series = Array.isArray(fm.series) ? fm.series : [fm.series];
  if (fm.draft === true) out.draft = true;
  if (fm.author) out.author = fm.author;

  const cover = fm.featuredImage || "";
  if (cover) out.cover = cover;

  out.layout = "layouts/post.njk";

  // Clean up Hugo-specific HTML/shortcodes from body
  let cleanBody = body
    .replace(/<div id="cusdis_thread"[\s\S]*?<\/script>/g, "")
    .replace(/<script[\s\S]*?cusdis[\s\S]*?<\/script>/g, "");

  return `---\n${stringifyYaml(out).trim()}\n---\n${cleanBody}`;
}

function walk(dir, callback) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, callback);
    else callback(full);
  }
}

const [,, srcDir, destDir] = process.argv;
if (!srcDir || !destDir) {
  console.error("Usage: node migrate-frontmatter.mjs <srcDir> <destDir>");
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

let count = 0;
walk(srcDir, (file) => {
  const rel = file.slice(srcDir.length + 1);
  const dest = join(destDir, rel);
  mkdirSync(join(destDir, rel.replace(/[^/]+$/, "")), { recursive: true });

  if (extname(file) === ".md") {
    const raw = readFileSync(file, "utf8");
    writeFileSync(dest, migrateFrontMatter(raw));
    count++;
    console.log("  migrated:", rel);
  } else {
    copyFileSync(file, dest);
    console.log("  copied:", rel);
  }
});

console.log(`\nDone: migrated ${count} markdown files.`);
