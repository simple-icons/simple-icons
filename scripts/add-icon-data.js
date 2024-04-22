#!/usr/bin/env node
import process from 'node:process';
import {ExitPromptError, checkbox, confirm, input} from '@inquirer/prompts';
import chalk from 'chalk';
import {search} from 'fast-fuzzy';
import getRelativeLuminance from 'get-relative-luminance';
import autocomplete from 'inquirer-autocomplete-standalone';
import {
  URL_REGEX,
  collator,
  getIconsDataString,
  normalizeColor,
  titleToSlug,
} from '../sdk.mjs';
import {getJsonSchemaData, writeIconsData} from './utils.js';

const iconsData = JSON.parse(await getIconsDataString());
const jsonSchema = await getJsonSchemaData();

const HEX_REGEX = /^#?[a-f\d]{3,8}$/i;

const aliasTypes = ['aka', 'old'].map((key) => ({
  name: `${key} (${jsonSchema.definitions.brand.properties.aliases.properties[key].description})`,
  value: key,
}));

const licenseTypes =
  jsonSchema.definitions.brand.properties.license.oneOf[0].properties.type.enum.map(
    (license) => ({name: license, value: license}),
  );

const isValidURL = (input) =>
  URL_REGEX.test(input) || 'Must be a valid and secure (https://) URL.';

const isValidHexColor = (input) =>
  HEX_REGEX.test(input) || 'Must be a valid hex code.';

const isNewIcon = (input) =>
  !iconsData.icons.some(
    (icon) =>
      icon.title === input || titleToSlug(icon.title) === titleToSlug(input),
  ) || 'This icon title or slug already exists.';

const previewHexColor = (input) => {
  const color = normalizeColor(input);
  const luminance = HEX_REGEX.test(input)
    ? getRelativeLuminance.default(`#${color}`)
    : -1;
  if (luminance === -1) return input.toUpperCase();
  return chalk.bgHex(`#${color}`).hex(luminance < 0.4 ? '#fff' : '#000')(
    input.toUpperCase(),
  );
};

try {
  const answers = {
    title: await input({
      message: 'What is the title of this icon?',
      validate: (input) =>
        input.trim().length > 0 ? isNewIcon(input) : 'This field is required.',
    }),
    hex: normalizeColor(
      await input({
        message: 'What is the brand color of this icon?',
        validate: isValidHexColor,
        transformer: previewHexColor,
      }),
    ),
    source: await input({
      message: 'What is the source URL of the icon?',
      validate: isValidURL,
    }),
    guidelines: (await confirm({
      message: 'Does this icon have brand guidelines?',
    }))
      ? await input({
          message: 'What is the URL for the brand guidelines?',
          validate: isValidURL,
        })
      : undefined,
    license: (await confirm({
      message: 'Does this icon have a license?',
    }))
      ? {
          type: await autocomplete({
            message: "What is the icon's license?",
            async source(input) {
              input = (input || '').trim();
              return input
                ? search(input, licenseTypes, {keySelector: (x) => x.value})
                : licenseTypes;
            },
          }),
          url:
            (await input({
              message: `What is the URL for the license? (optional)`,
              validate: (input) => input.length === 0 || isValidURL(input),
            })) || undefined,
        }
      : undefined,
    aliases: (await confirm({
      message: 'Does this icon have brand aliases?',
      default: false,
    }))
      ? await checkbox({
          message: 'What types of aliases do you want to add?',
          choices: aliasTypes,
        }).then(async (aliases) => {
          const result = {};
          for (const alias of aliases) {
            // eslint-disable-next-line no-await-in-loop
            result[alias] = await input({
              message: `What ${alias} aliases would you like to add? (separate with commas)`,
            }).then((aliases) =>
              aliases.split(',').map((alias) => alias.trim()),
            );
          }

          return result;
        })
      : undefined,
  };

  console.log(
    'About to write the following to simple-icons.json:\n' +
      JSON.stringify(answers, null, 4),
  );

  if (
    await confirm({
      message: 'Is this OK?',
    })
  ) {
    iconsData.icons.push(answers);
    iconsData.icons.sort((a, b) => collator.compare(a.title, b.title));
    await writeIconsData(iconsData);
    console.log(chalk.green('\nData written successfully.'));
  } else {
    console.log(chalk.red('\nAborted.'));
    process.exit(1);
  }
} catch (error) {
  if (error instanceof ExitPromptError) {
    console.log(chalk.red('\nAborted.'));
    process.exit(1);
  }

  throw error;
}
