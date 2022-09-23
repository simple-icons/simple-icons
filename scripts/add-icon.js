import fs from 'node:fs/promises';
import inquirer from 'inquirer';
import chalkPipe from 'chalk-pipe';
import logSymbols from 'log-symbols';
import { getIconsDataString, titleToSlug } from './utils.js';

const prompts = [
  {
    type: 'input',
    name: 'title',
    message: 'Title',
  },
  {
    type: 'input',
    name: 'hex',
    message: 'HEX color',
    validate: (text) => /^[a-fA-F0-9]{6}$/.test(text.replace(/^#/, '')),
    transformer: (text) => {
      return chalkPipe(text.startsWith('#') ? text : `#${text}`)(text);
    },
  },
  {
    type: 'input',
    name: 'source',
    message: 'source',
  },
];

const icon = await inquirer.prompt(prompts);
const iconsData = JSON.parse(await getIconsDataString());

if (iconsData.icons.find((x) => x.title === icon.title)) {
  console.error(logSymbols.error, 'Duplicated icon');
  process.exit(1);
}

console.log(
  logSymbols.success,
  `Icon added, your icon filename should be: ${chalkPipe('blue')(
    titleToSlug(icon.title) + '.svg',
  )}`,
);
