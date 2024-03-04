import process from 'node:process';
import { string, multiselect, select, toggle, log } from 'prask';
import {
  collator,
  getIconsDataString,
  titleToSlug,
  normalizeColor,
} from '../sdk.mjs';
import { getJsonSchemaData, writeIconsData } from './utils.js';

const iconsData = JSON.parse(await getIconsDataString());
const jsonSchema = await getJsonSchemaData();

const aliasTypes = ['aka', 'old'].map((key) => ({
  title: `${key} (${jsonSchema.definitions.brand.properties.aliases.properties[key].description})`,
  value: key,
}));

const licenseTypes =
  jsonSchema.definitions.brand.properties.license.oneOf[0].properties.type.enum.map(
    (license) => ({ title: license, value: license }),
  );

const isSecureURL = (input) => {
  if (!URL.canParse(input)) {
    return 'Must be a valid URL.';
  }
  if (new URL(input).protocol !== 'https:') {
    return 'Must be a secure URL (HTTPS).';
  }
  return true;
};

const isValidHexColor = (input) =>
  /^#?[a-f0-9]{3,8}$/i.test(input) || 'Must be a valid hex code.';

const isNewIcon = (input) =>
  !iconsData.icons.find(
    (icon) =>
      icon.title === input || titleToSlug(icon.title) === titleToSlug(input),
  ) || 'This icon title or slug already exists.';

const aliasesTransformer = (input) =>
  input.split(',').map((alias) => alias.trim());

const answers = {
  title: await string({
    message: 'What is the title of this icon?',
    required: true,
    validate: isNewIcon,
  }),
  hex: await string({
    message: 'What is the brand color of this icon?',
    required: true,
    validate: isValidHexColor,
    transform: normalizeColor,
  }),
  source: await string({
    message: 'What is the source URL of the icon?',
    required: true,
    validate: isSecureURL,
  }),
  guidelines: (await toggle({
    message: 'Does this icon have brand guidelines?',
    required: true,
  }))
    ? await string({
        message: 'What is the URL for the brand guidelines?',
        required: true,
        validate: isSecureURL,
      })
    : undefined,
  license: (await toggle({
    message: 'Does this icon have a license?',
    required: true,
  }))
    ? {
        type: await select({
          message: "What is the icon's license?",
          required: true,
          options: licenseTypes,
          searchable: true,
        }),
        url:
          (await string({
            message: `What is the URL for the license? (optional)`,
            required: false,
            validate: (input) => !Boolean(input) || isSecureURL(input),
          })) || undefined,
      }
    : undefined,
  aliases: (await toggle({
    message: 'Does this icon have brand aliases?',
    required: true,
    initial: false,
  }))
    ? await multiselect({
        message: 'What types of aliases do you want to add?',
        required: true,
        options: aliasTypes,
      }).then(async (aliases) => {
        const result = {};
        for (const alias of aliases) {
          result[alias] = await string({
            message: `What ${alias} aliases would you like to add? (separate with commas)`,
            required: true,
            transform: aliasesTransformer,
          });
        }
        return result;
      })
    : undefined,
};

log.question(
  'About to write the following to simple-icons.json:\n' +
    JSON.stringify(answers, null, 4),
);

if (
  await toggle({
    message: 'Is this OK?',
  })
) {
  iconsData.icons.push(answers);
  iconsData.icons.sort((a, b) => collator.compare(a.title, b.title));
  await writeIconsData(iconsData);
  log.success('Data written successfully.');
} else {
  log.error('Aborted.');
  process.exit(1);
}
