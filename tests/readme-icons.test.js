import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'mocha';
import { strict as assert } from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(__dirname);
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
