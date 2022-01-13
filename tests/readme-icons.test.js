import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'uvu';
import * as assert from 'uvu/assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url)),
  root = path.dirname(__dirname),
  blackIconsPath = path.join(root, 'icons'),
  whiteIconsPath = path.join(root, 'assets', 'readme'),
  whiteIconsFileNames = fs.readdirSync(whiteIconsPath);

for (let whiteIconFileName of whiteIconsFileNames) {
  const whiteIconPath = path.join(whiteIconsPath, whiteIconFileName),
    blackIconPath = path.join(
      blackIconsPath,
      whiteIconFileName.replace(/-white\.svg$/, '.svg'),
    ),
    whiteIconRelPath = path.relative(root, whiteIconPath),
    blackIconRelPath = path.relative(root, blackIconPath);

  test(`'${whiteIconRelPath}' content must be equivalent to '${blackIconRelPath}' content`, () => {
    assert.ok(
      whiteIconFileName.endsWith('-white.svg'),
      `README icon assets file name '${whiteIconFileName}'` +
        " must ends with '-white.svg'.",
    );

    assert.ok(
      fs.existsSync(blackIconPath),
      `Equivalent icon '${blackIconRelPath}' for README asset '${whiteIconRelPath}'` +
        ` not found in '${path.dirname(blackIconRelPath)}' directory.`,
    );

    const whiteIconContent = fs.readFileSync(whiteIconPath, 'utf8'),
      blackIconContent = fs.readFileSync(blackIconPath, 'utf8');
    assert.equal(
      whiteIconContent,
      blackIconContent.replace('<svg', '<svg fill="white"'),
    );
  });

  test.run();
}
