#!/usr/bin/env node
// Recovers the 3 HTML-only posts into properly formatted markdown by converting
// the actual <div class="post-content"> HTML body with Turndown (preserves
// headings, code blocks, images, links, lists).
//
// Source: the built HTML on the `master` branch of this repo.
// Usage: node scripts/recover-html-posts.mjs

import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import TurndownService from "turndown";

const td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
});

// Convert Hugo/Chroma highlighted code blocks to fenced markdown.
// Chroma emits a 2-column table: line numbers (lnt spans) + real code
// (code.language-xxx with data-lang). We must select the code column only.
td.addRule("hugoHighlight", {
  filter: (node) =>
    node.nodeName === "DIV" && /highlight/.test(node.getAttribute("class") || ""),
  replacement: (content, node) => {
    // Prefer the <code> element that carries a data-lang (the real code column).
    let codeEl = node.querySelector("code[data-lang]");
    let lang = "";
    if (codeEl) {
      lang = codeEl.getAttribute("data-lang") || "";
    } else {
      // Fallback: last <code> (code column comes after the line-number column).
      const codes = node.querySelectorAll("code");
      codeEl = codes[codes.length - 1];
    }
    let code = codeEl ? codeEl.textContent : node.textContent;
    code = code.replace(/\n+$/, "");
    return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  },
});

const posts = [
  { slug: "mlops_1", out: "mlops_infrastructure.md",
    title: "Robust MLOps Infrastructure",
    date: "2025-02-25T19:16:40Z",
    tags: ["mlops", "architecture", "databricks", "ml"],
    categories: ["MLOps", "ML"] },
  { slug: "sql_50", out: "sql_50_mastery.md",
    title: "Top 50 SQL for Mastery",
    date: "2024-12-25T15:52:11Z",
    tags: ["sql", "data", "interview"],
    categories: ["data", "SQL"] },
  { slug: "nvidia_cuda_ubuntu1", out: "nvidia_cuda_ubuntu1.md",
    title: "Install Cuda 12.2 in Ubuntu 24.04",
    date: "2024-08-16T10:56:06+01:00",
    tags: ["nvidia", "cuda", "ubuntu", "installation"],
    categories: ["Installation", "Nvidia"] },
];

import { JSDOM } from "jsdom";

for (const p of posts) {
  const html = execSync(`git show master:posts/${p.slug}/index.html`, {
    encoding: "utf8", maxBuffer: 20 * 1024 * 1024,
  });

  const dom = new JSDOM(html);
  const contentEl = dom.window.document.querySelector(".post-content");
  if (!contentEl) {
    console.error(`  !! No .post-content found for ${p.slug}`);
    continue;
  }

  // Remove the duplicate H1 (we render title from front matter) and anchor links
  const firstH1 = contentEl.querySelector("h1");
  if (firstH1) firstH1.remove();
  contentEl.querySelectorAll("a.anchor").forEach((a) => a.remove());

  let md = td.turndown(contentEl.innerHTML);

  const fm = [
    "---",
    `title: "${p.title}"`,
    `date: ${p.date}`,
    "tags:",
    ...p.tags.map((t) => `  - ${t}`),
    "categories:",
    ...p.categories.map((c) => `  - ${c}`),
    "author: shekhar",
    "layout: layouts/post.njk",
    "---",
    "",
    md,
    "",
  ].join("\n");

  mkdirSync("content/blog", { recursive: true });
  writeFileSync(`content/blog/${p.out}`, fm);
  console.log(`Recovered (formatted): content/blog/${p.out}  [${md.length} chars md]`);
}
