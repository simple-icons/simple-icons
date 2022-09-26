import fs from 'node:fs';
import path from 'node:path';
import {strict as assert} from 'node:assert';
import {describe, test} from 'mocha';
import {
  getThirdPartyExtensions,
  getDirnameFromImportMeta,
} from '../scripts/utils.js';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const root = path.dirname(__dirname);

describe('README icons assets must be consistent with Github themes', () => {
  const blackIconsPath = path.join(root, 'icons');
  const whiteIconsPath = path.join(root, 'assets', 'readme');
  const whiteIconsFileNames = fs.readdirSync(whiteIconsPath);

  for (const whiteIconFileName of whiteIconsFileNames) {
    const whiteIconPath = path.join(whiteIconsPath, whiteIconFileName);
    const blackIconPath = path.join(
      blackIconsPath,
      whiteIconFileName.replace(/-white\.svg$/, '.svg'),
    );
    const whiteIconRelPath = path.relative(root, whiteIconPath);
    const blackIconRelPath = path.relative(root, blackIconPath);

    test(`'${whiteIconRelPath}' content must be equivalent to '${blackIconRelPath}' content`, () => {
      assert.ok(
        whiteIconFileName.endsWith('-white.svg'),
        `README icon assets file name '${whiteIconFileName}'` +
          " must ends with '-white.svg'.",
      );

      assert.ok(
        fs.existsSync(blackIconPath),
        `Corresponding icon '${blackIconRelPath}' for README asset '${whiteIconRelPath}'` +
          ` not found in '${path.dirname(blackIconRelPath)}' directory.`,
      );

      const whiteIconContent = fs.readFileSync(whiteIconPath, 'utf8');
      const blackIconContent = fs.readFileSync(blackIconPath, 'utf8');
      assert.equal(
        whiteIconContent,
        blackIconContent.replace('<svg', '<svg fill="white"'),
      );
    });
  }
});

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
  const ignoreHttpLinks = new Set(['http://www.w3.org/2000/svg']);

  const docsFiles = fs
    .readdirSync(root)
    .filter((fname) => fname.endsWith('.md'));

  const linksGetter = /http:\/\/b[^\s"']+/g;
  for (const docsFile of docsFiles) {
    const docsFilePath = path.join(root, docsFile);
    const docsFileContent = fs.readFileSync(docsFilePath, 'utf8');

    for (const match of Array.from(docsFileContent.matchAll(linksGetter))) {
      const link = match[0];
      assert.ok(
        ignoreHttpLinks.has(link) || link.startsWith('https://'),
        `Link '${link}' in '${docsFile}' (at index ${match.index})` +
          ` must use the HTTPS protocol.`,
      );
    }
  }
});
