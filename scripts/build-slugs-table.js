#!/usr/bin/env node
/**
 * @fileoverview
 * Generates a MarkDown file that lists every brand name and their slug.
 */

const fs = require("fs");
const path = require("path");

const dataFile = path.resolve(__dirname, "..", "_data", "simple-icons.json");
const slugsFile = path.resolve(__dirname, "..", "slugs.md");

const data = require(dataFile);
const { titleToSlug } = require("./utils.js");

let content = `# Simple Icons slugs
s
| Brand name | Brand slug |
| :--- | :--- |
`;

data.icons.forEach(icon => {
  const brandName = icon.title;
  const brandSlug = titleToSlug(icon.title);
  content += `| \`${brandName}\` | \`${brandSlug}\` |\n`
});

fs.writeFileSync(slugsFile, content);
