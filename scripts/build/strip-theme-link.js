/**
 * @fileoverview
 * Simple Icons strip theme URL script.
 */

import path from 'node:path';
import { writeFile, readFile } from 'node:fs/promises';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);

const rootDir = path.resolve(__dirname, '..', '..');
const readmeFile = path.resolve(rootDir, 'README.md');

const readme = await readFile(readmeFile, 'utf8');
await writeFile(
  readmeFile,
  readme.replace(
    /https:\/\/cdn.simpleicons.org\/(.+)\/000\/fff/g,
    'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/$1.svg',
  ),
);
