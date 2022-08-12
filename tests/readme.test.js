import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'mocha';
import { strict as assert } from 'node:assert';
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

  for (let whiteIconFileName of whiteIconsFileNames) {
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
