import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'mocha';
import { strict as assert } from 'node:assert';
import { getThirdPartyExtensions, getDirnameFromImportMeta } from '../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const root = path.dirname(__dirname);

test('README third party extensions must be alphabetically sorted', async () => {
  const readmePath = path.join(root, 'README.md');
  const thirdPartyExtensions = await getThirdPartyExtensions(readmePath);
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

  const docsFiles = fs
    .readdirSync(root)
    .filter((fname) => fname.endsWith('.md'));

  const linksGetter = new RegExp('http://[^\\s"\']+', 'g');
  for (let docsFile of docsFiles) {
    const docsFilePath = path.join(root, docsFile);
    const docsFileContent = fs.readFileSync(docsFilePath, 'utf8');

    Array.from(docsFileContent.matchAll(linksGetter)).forEach((match) => {
      const link = match[0];
      assert.ok(
        ignoreHttpLinks.includes(link) || link.startsWith('https://'),
        `Link '${link}' in '${docsFile}' (at index ${match.index})` +
          ` must use the HTTPS protocol.`,
      );
    });
  }
});
