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

const getIconDataFromAnswers = (answers) => ({
  title: answers.title,
  hex: answers.hex,
  source: answers.source,
  ...(answers.hasGuidelines ? { guidelines: answers.guidelines } : {}),
  ...(answers.hasLicense
    ? {
        license: {
          type: answers.licenseType,
          ...(answers.licenseUrl ? { url: answers.licenseUrl } : {}),
        },
      }
    : {}),
});

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
    name: 'hasGuidelines',
    message: 'The icon has brand guidelines?',
  },
  {
    type: 'input',
    name: 'guidelines',
    message: 'Guidelines',
    validate: sourceValidator,
    when: ({ hasGuidelines }) => hasGuidelines,
  },
  {
    type: 'confirm',
    name: 'hasLicense',
    message: 'The icon has brand license?',
  },
  {
    type: 'input',
    name: 'licenseType',
    message: 'License type',
    validate: (text) => Boolean(text),
    when: ({ hasLicense }) => hasLicense,
  },
  {
    type: 'input',
    name: 'licenseUrl',
    message: 'License URL',
    suffix: ' (optional)',
    validate: (text) => !Boolean(text) || sourceValidator(text),
    when: ({ hasLicense }) => hasLicense,
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: (answers) => {
      const icon = getIconDataFromAnswers(answers);
      return [
        'About to write to simple-icons.json',
        chalk.reset(JSON.stringify(icon, null, 4)),
        chalk.reset('Is this OK?'),
      ].join('\n\n');
    },
  },
];

const answers = await inquirer.prompt(dataPrompt);
const icon = getIconDataFromAnswers(answers);

if (answers.confirm) {
  iconsData.icons.push(icon);
  iconsData.icons.sort((a, b) => collator.compare(a.title, b.title));
  await writeIconsData(iconsData);
} else {
  console.log('Aborted.');
  process.exit(1);
}
