/**
 * @fileoverview
 * Script to add data for a new icon to the simple-icons dataset.
 */

/**
 * @typedef {import("../sdk.js").IconData} IconData
 */

import process from 'node:process';
import chalk from 'chalk';
import { input, confirm, checkbox, ExitPromptError } from '@inquirer/prompts';
import autocomplete from 'inquirer-autocomplete-standalone';
import getRelativeLuminance from 'get-relative-luminance';
import { search } from 'fast-fuzzy';
import {
  URL_REGEX,
  collator,
  getIconsDataString,
  titleToSlug,
  normalizeColor,
} from '../sdk.mjs';
import { getJsonSchemaData, writeIconsData } from './utils.js';

const hexPattern = /^#?[a-f0-9]{3,8}$/i;

/** @type {{icons: IconData[]}} */
const iconsData = JSON.parse(await getIconsDataString());
const jsonSchema = await getJsonSchemaData();

/** @param {String} text */
const titleValidator = (text) => {
  if (!text) return 'This field is required';
  if (
    iconsData.icons.find(
      (x) => x.title === text || titleToSlug(x.title) === titleToSlug(text),
    )
  )
    return 'This icon title or slug already exists';
  return true;
};

/** @param {String} text */
const hexValidator = (text) =>
  hexPattern.test(text) || 'This should be a valid hex code';

/** @param {String} text */
const sourceValidator = (text) =>
  URL_REGEX.test(text) || 'This should be a secure URL';

/** @param {String} text */
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

/** @param {String} text */
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

/**
 * @typedef {{
 *   title: String,
 *   hex: String,
 *   source: String,
 *   guidelines?: String,
 *   licenseType?: String,
 *   licenseUrl?: String,
 *   aliases?: {
 *    [key: String]: String,
 *   },
 * }} Answers
 */

/**
 * Build the new icon data from user inputs.
 * @param {Answers} answers
 */
const getIconDataFromAnswers = (answers) => {
  console.log(answers);
  return {
    title: answers.title,
    hex: normalizeColor(answers.hex),
    source: answers.source,
    ...(answers.guidelines ? { guidelines: answers.guidelines } : {}),
    ...(answers.licenseType
      ? {
          license: {
            type: answers.licenseType,
            ...(answers.licenseUrl ? { url: answers.licenseUrl } : {}),
          },
        }
      : {}),
    ...(answers.aliases
      ? {
          aliases: aliasesChoices.reduce((previous, current) => {
            const promptKey = current.value;
            if (answers.aliases?.hasOwnProperty(promptKey))
              return {
                ...previous,
                [current.value]: answers.aliases[promptKey]
                  .split(',')
                  .map((x) => x.trim()),
              };
            return previous;
          }, {}),
        }
      : {}),
  };
};

const run = async () => {
  const answers = {};

  answers.title = await input({
    message: 'Title:',
    validate: titleValidator,
  });

  answers.hex = await input({
    message: 'Hex:',
    validate: hexValidator,
    transformer: hexTransformer,
  });

  answers.source = await input({
    message: 'Source URL:',
    validate: sourceValidator,
  });

  const hasGuidelines = await confirm({
    message: 'The icon has brand guidelines?',
  });

  if (hasGuidelines) {
    answers.guidelines = await input({
      message: 'Guidelines URL:',
      validate: sourceValidator,
    });
  }

  const hasLicense = await confirm({
    message: 'The icon has brand license?',
  });

  if (hasLicense) {
    const licenseTypes =
      jsonSchema.definitions.brand.properties.license.oneOf[0].properties.type.enum.map(
        /**
         * @param {String} license
         * @returns {{value: String}}
         */
        (license) => {
          return { value: license };
        },
      );

    /** @type {String} */
    answers.licenseType = await autocomplete({
      message: 'License type:',
      source: async (input) => {
        input = (input || '').trim();
        return input
          ? search(input, licenseTypes, {
              // TODO: treat `licenseTypes T` as `x: T` in fast-fuzzy
              // @ts-ignore
              keySelector: (x) => x.value,
            })
          : licenseTypes;
      },
    });

    answers.licenseUrl = await input({
      message: `License URL ${chalk.reset('(optional)')}:`,
      validate: (text) => text.length === 0 || sourceValidator(text),
    });
  }

  const hasAliases = await confirm({
    message: 'This icon has brand aliases?',
    default: false,
  });

  if (hasAliases) {
    const aliasesTypes = await checkbox({
      message: 'What types of aliases do you want to add?',
      choices: aliasesChoices,
    });

    /** @type {{[key: String]: String}} */
    answers.aliases = aliasesTypes.reduce((a, v) => ({ ...a, [v]: '' }), {});

    for (const x of aliasesChoices) {
      if (!answers?.aliases?.hasOwnProperty(x.value)) continue;
      answers.aliases[x.value] = await input({
        message: x.value + chalk.reset(' (separate with commas)'),
        validate: (text) => text.trim().length > 0,
        transformer: aliasesTransformer,
      });
    }
  }

  const confirmToAdd = await confirm({
    message: [
      'About to write the following to simple-icons.json:',
      chalk.reset(JSON.stringify(getIconDataFromAnswers(answers), null, 4)),
      chalk.reset('Is this OK?'),
    ].join('\n\n'),
  });

  if (confirmToAdd) {
    const icon = getIconDataFromAnswers(answers);
    iconsData.icons.push(icon);
    iconsData.icons.sort((a, b) => collator.compare(a.title, b.title));
    await writeIconsData(iconsData);
    console.log(chalk.green('\nData written successfully.'));
  } else {
    console.log(chalk.red('\nAborted.'));
    process.exit(1);
  }
};

const main = async () => {
  try {
    await run();
  } catch (err) {
    if (err instanceof ExitPromptError) {
      console.log(chalk.red('\nAborted.'));
      process.exit(1);
    }

    throw err;
  }
};

await main();
