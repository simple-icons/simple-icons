import { test, exec } from 'uvu';
import * as assert from 'uvu/assert';
import path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

(async () => {
  test(`Check readme light and dark icons`, () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const lightIconsPath = path.resolve(__dirname, '../assets/readme');
    const darkIconsPath = path.resolve(__dirname, '../assets/readme');
    fs.readdirSync(lightIconsPath).forEach((file) => {
      const lightContent = fs.readFileSync(
        path.resolve(darkIconsPath, file),
        'utf8',
      );
      const darkContent = fs.readFileSync(
        path.resolve(darkIconsPath, file),
        'utf8',
      );

      //compare light svgs to dark ones. The only difference should be a fill="white" attribute
      assert.ok(
        lightContent
          .replace(/ /g, '')
          .replace('fill="white"', '')
          .localeCompare(darkContent.replace(/ /g, '')),
      );
    });
  });

  test.run();
  exec();
})();
