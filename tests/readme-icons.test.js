import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, exec } from 'uvu';
import * as assert from 'uvu/assert';

(async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)),
    root = path.dirname(__dirname),
    darkIconsPath = path.join(root, 'icons'),
    lightIconsPath = path.join(root, 'assets', 'readme'),
    lightIconsFileNames = await fs.readdir(lightIconsPath);

  for (let lightIconFileName of lightIconsFileNames) {
    const lightIconPath = path.join(lightIconsPath, lightIconFileName),
      darkIconPath = path.join(
        darkIconsPath,
        lightIconFileName.replace(/-white\.svg$/, '.svg'),
      ),
      lightIconRelPath = path.relative(root, lightIconPath),
      darkIconRelPath = path.relative(root, darkIconPath),
      lightIconContent = await fs.readFile(lightIconPath, 'utf8'),
      darkIconContent = await fs.readFile(darkIconPath, 'utf8');

    test(`'${lightIconRelPath}' content must be equivalent to '${darkIconRelPath}' content`, () => {
      assert.equal(
        lightIconContent.replace(' fill="white"', ''),
        darkIconContent,
      );
    });
  }
  test.run();
  exec();
})();
