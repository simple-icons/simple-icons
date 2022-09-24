import fs from 'node:fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import getRelativeLuminance from 'get-relative-luminance';
import {
  URL_REGEX,
  collator,
  getIconsDataString,
  getIconDataPath,
  writeIconsData,
  titleToSlug,
  normalizeColor,
} from './utils.js';

const hexPattern = /^#?[a-f0-9]{3,8}$/i;

const iconsData = JSON.parse(await getIconsDataString());

const titleValidator = (text) => {
  if (!text) return 'This field is required';
  if (
    iconsData.icons.find(
      (x) => x.title === text || titleToSlug(x.title) === titleToSlug(text),
    )
  )
    return 'This icon title or slug already exist';
  return true;
};

const hexValidator = (text) =>
  hexPattern.test(text) ? true : 'This should be a valid hex code';

const sourceValidator = (text) =>
  URL_REGEX.test(text) ? true : 'This should be a secure URL';

const hexTransformer = (text) => {
  const color = normalizeColor(text);
  const luminance = hexPattern.test(text)
    ? getRelativeLuminance.default(`#${color}`)
    : -1;
  if (luminance === -1) return text;
  return chalk.bgHex(`#${color}`).hex(luminance < 0.4 ? '#fff' : '#000')(text);
};

const dataPrompt = [
  {
    type: 'input',
    name: 'title',
    message: 'Title',
    validate: titleValidator,
  },
  {
    type: 'input',
    name: 'hex',
    message: 'Hex',
    validate: hexValidator,
    filter: (text) => normalizeColor(text),
    transformer: hexTransformer,
  },
  {
    type: 'input',
    name: 'source',
    message: 'Source',
    validate: sourceValidator,
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: (answers) =>
      [
        'About to write to simple-icons.json',
        chalk.reset(JSON.stringify(answers, null, 4)),
        chalk.reset('Is this OK?'),
      ].join('\n\n'),
  },
];

const { confirm, ...icon } = await inquirer.prompt(dataPrompt);

if (confirm) {
  iconsData.icons.push(icon);
  iconsData.icons.sort((a, b) => collator.compare(a.title, b.title));
  await writeIconsData(iconsData);
} else {
  console.log('Aborted.');
  process.exit(1);
}
