import chalk from 'chalk';
import { input, confirm, checkbox } from '@inquirer/prompts';
import getRelativeLuminance from 'get-relative-luminance';
import {
  URL_REGEX,
  collator,
  getIconsDataString,
  titleToSlug,
  normalizeColor,
} from '../sdk.mjs';
import { getJsonSchemaData, writeIconsData } from './utils.js';

const hexPattern = /^#?[a-f0-9]{3,8}$/i;

const iconsData = JSON.parse(await getIconsDataString());
const jsonSchema = await getJsonSchemaData();

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
  if (luminance === -1) return text.toUpperCase();
  return chalk.bgHex(`#${color}`).hex(luminance < 0.4 ? '#fff' : '#000')(
    text.toUpperCase(),
  );
};

const aliasesTransformer = (text) =>
  text
    .split(',')
    .map((x) => chalk.cyan(x))
    .join(',');

const aliasesChoices = Object.entries(
  jsonSchema.definitions.brand.properties.aliases.properties,
)
  .filter(([k]) => ['aka', 'old'].includes(k))
  .map(([k, v]) => ({ name: `${k}: ${v.description}`, value: k }));

const getIconDataFromAnswers = (answers) => ({
  title: answers.title,
  hex: answers.hex.toUpperCase(),
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
  ...(answers.hasAliases
    ? {
        aliases: aliasesChoices.reduce((previous, current) => {
          const promptKey = `${current.value}AliasesList`;
          if (answers[promptKey])
            return {
              ...previous,
              [current.value]: answers[promptKey]
                .split(',')
                .map((x) => x.trim()),
            };
          return previous;
        }, {}),
      }
    : {}),
});

const answers = {};

answers.title = await input({
  message: 'Title',
  validate: titleValidator,
});

answers.hex = await input({
  message: 'Hex',
  validate: hexValidator,
  filter: (text) => normalizeColor(text),
  transformer: hexTransformer,
});

answers.source = await input({
  message: 'Source',
  validate: sourceValidator,
});

answers.hasGuidelines = await confirm({
  message: 'The icon has brand guidelines?',
});

if (answers.hasGuidelines) {
  answers.guidelines = await input({
    message: 'Guidelines',
    validate: sourceValidator,
  });
}

answers.hasLicense = await confirm({
  message: 'The icon has brand license?',
});

if (answers.hasLicense) {
  answers.licenseType = await input({
    message: 'License type',
    validate: (text) => Boolean(text),
  });

  answers.licenseUrl = await input({
    message: 'License URL' + chalk.reset(' (optional)'),
    validate: (text) => !Boolean(text) || sourceValidator(text),
  });
}

answers.hasAliases = await confirm({
  message: 'This icon has brands aliases?',
  default: false,
});

if (answers.hasAliases) {
  answers.aliasesTypes = await checkbox({
    message: 'What types of aliases do you want to add?',
    choices: aliasesChoices,
  });

  for (const x of aliasesChoices) {
    if (!answers?.aliasesTypes?.includes(x.value)) continue;
    answers[`${x.value}AliasesList`] = await input({
      message: x.value + chalk.reset(' (separate with commas)'),
      validate: (text) => Boolean(text),
      transformer: aliasesTransformer,
    });
  }
}

answers.confirmToAdd = await confirm({
  message: [
    'About to write to simple-icons.json',
    chalk.reset(JSON.stringify(getIconDataFromAnswers(answers), null, 4)),
    chalk.reset('Is this OK?'),
  ].join('\n\n'),
});

const icon = getIconDataFromAnswers(answers);

if (answers.confirmToAdd) {
  iconsData.icons.push(icon);
  iconsData.icons.sort((a, b) => collator.compare(a.title, b.title));
  await writeIconsData(iconsData);
} else {
  console.log('Aborted.');
  process.exit(1);
}
