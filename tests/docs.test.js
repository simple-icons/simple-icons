import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'mocha';
import { strict as assert } from 'node:assert';
import {
  getThirdPartyExtensions,
  getDirnameFromImportMeta,
  URL_REGEX,
} from '../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const root = path.dirname(__dirname);
const getLinksRegex = new RegExp(
  URL_REGEX.source.replace('^https', 'https?'),
  'gm',
);

test('README third party extensions must be alphabetically sorted', async () => {
  const thirdPartyExtensions = await getThirdPartyExtensions();
  assert.ok(thirdPartyExtensions.length > 0);

  const thirdPartyExtensionsNames = thirdPartyExtensions.map(
    (ext) => ext.module.name,
  );

  const expectedOrder = thirdPartyExtensionsNames.slice().sort();
  assert.deepEqual(
    thirdPartyExtensionsNames,
    expectedOrder,
    'Wrong alphabetical order of third party extensions in README.',
  );
});

test('Only allow HTTPS links in documentation pages', async () => {
  const ignoreHttpLinks = ['http://www.w3.org/2000/svg'];

  const docsFiles = (await fs.readdir(root)).filter((fname) =>
    fname.endsWith('.md'),
  );

  for (const docsFile of docsFiles) {
    const docsFilePath = path.join(root, docsFile);
    const docsFileContent = await fs.readFile(docsFilePath, 'utf8');

    for (const match of docsFileContent.matchAll(getLinksRegex)) {
      const link = match[0];
      assert.ok(
        ignoreHttpLinks.includes(link) || link.startsWith('https://'),
        `Link '${link}' in '${docsFile}' (at index ${match.index})` +
          ` must use the HTTPS protocol.`,
      );
    }
  }
});
