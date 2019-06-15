#!/usr/bin/env node
/**
 * @fileoverview
 * Compiles our icons into static .js files that can be imported in the browser
 * and are tree-shakeable.
 * The static .js files go in icons/{filename}.js.
 * Also generates an index.js that exports all icons by title, but is not tree-shakeable
 */

const dataFile = "../_data/simple-icons.json";
const indexFile = `${__dirname}/../index.js`;
const iconsDir = `${__dirname}/../icons`;
const data = require(dataFile);
const fs = require("fs");

const { titleToFilename } = require("./utils");

const icons = {};
data.icons.forEach(icon => {
    const filename = titleToFilename(icon.title);
    icon.svg = fs.readFileSync(`${iconsDir}/${filename}.svg`, "utf8");
    icon.path = icon.svg.match(/<path\s+d="([^"]*)/)[1];
    icons[icon.title] = icon;
    // write the static .js file for the icon
    fs.writeFileSync(
        `${iconsDir}/${filename}.js`,
        `module.exports=${JSON.stringify(icon)};`
    );
});

/* Backwards compatibility */
// https://github.com/simple-icons/simple-icons/pull/1365
const adobeLightroom = icons["Adobe Lightroom Classic"];
adobeLightroom.title = "Adobe Lightroom";
icons["Adobe Lightroom"] = adobeLightroom;
fs.writeFileSync(
    `${iconsDir}/adobelightroom.svg`,
    adobeLightroom.svg
);
fs.writeFileSync(
    `${iconsDir}/adobelightroom.js`,
    `module.exports=${JSON.stringify(adobeLightroom)};`
);

// write our generic index.js
fs.writeFileSync(indexFile, `module.exports=${JSON.stringify(icons)};`);
