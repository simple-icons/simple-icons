import fs from 'node:fs/promises';
import inquirer from 'inquirer';
import chalkPipe from 'chalk-pipe';
import logSymbols from 'log-symbols';
import getRelativeLuminance from 'get-relative-luminance';
import { getIconsDataString, getIconDataPath, titleToSlug } from './utils.js';

const hexPattern = /^#?[a-fA-F0-9]{6}$/;
const iconsData = JSON.parse(await getIconsDataString());

const prompts = [
  {
    type: 'input',
    name: 'title',
    validate: (text) => {
      if (!text) return 'This field is required';
      if (iconsData.icons.find((x) => x.title === text))
        return 'This icon title already exist';
      return true;
    },
    message: 'Title',
  },
  {
    type: 'input',
    name: 'hex',
    message: 'Hex',
    validate: (text) =>
      hexPattern.test(text) ? true : 'This should be a 6-digit hex code',
    transformer: (text) => {
      const color = text.startsWith('#') ? text : `#${text}`;
      const luminance = hexPattern.test(text)
        ? getRelativeLuminance.default(color)
        : -1;
      if (luminance === -1) return text;
      return chalkPipe(`bg${color}.${luminance < 0.4 ? 'white' : 'black'}`)(
        text,
      );
    },
  },
  {
    type: 'input',
    name: 'source',
    message: 'Source',
    validate: (text) =>
      Boolean(text.startsWith('https://') || text.startsWith('http://'))
        ? true
        : 'This should be a URL',
  },
];

const icon = await inquirer.prompt(prompts);

iconsData.icons.push({
  title: icon.title,
  hex: icon.hex.replace(/^#/, '').toUpperCase(),
  source: icon.source,
});
iconsData.icons.sort((a, b) => a.title.localeCompare(b.title));

await fs.writeFile(
  getIconDataPath(),
  JSON.stringify(iconsData, null, 4) + '\n',
  'utf8',
);

console.log(
  logSymbols.success,
  `Icon added, your icon filename should be: ${chalkPipe('blue')(
    titleToSlug(icon.title) + '.svg',
  )}`,
);
