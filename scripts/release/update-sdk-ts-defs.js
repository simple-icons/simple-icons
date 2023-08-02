/**
 * @fileoverview
 * Updates the SDK Typescript definitions located in the file sdk.d.ts
 * to match the current definitions of functions of sdk.mjs.
 */

import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { getDirnameFromImportMeta } from '../../sdk.mjs';

const __dirname = getDirnameFromImportMeta(import.meta.url);
const rootDir = path.resolve(__dirname, '..', '..');

const sdkTs = path.resolve(rootDir, 'sdk.d.ts');
const sdkMts = path.resolve(rootDir, 'sdk.d.mts');
const sdkMjs = path.resolve(rootDir, 'sdk.mjs');

const generateSdkMts = async () => {
  // remove temporally type definitions imported with comments
  // in sdk.mjs to avoid circular imports
  const originalSdkMjsContent = await fs.readFile(sdkMjs, 'utf-8');
  const tempSdkMjsContent = originalSdkMjsContent
    .split('\n')
    .filter((line) => {
      return !line.startsWith(' * @typedef {import("./sdk")');
    })
    .join('\n');
  await fs.writeFile(sdkMjs, tempSdkMjsContent);
  try {
    execSync(
      'npx tsc sdk.mjs' +
        ' --declaration --emitDeclarationOnly --allowJs --removeComments',
    );
  } catch (error) {
    console.log(
      `Error ${error.status} generating Typescript` +
        ` definitions: '${error.message}'`,
    );
    process.exit(1);
  }
  await fs.writeFile(sdkMjs, originalSdkMjsContent);
};

const generateSdkTs = async () => {
  fsSync.existsSync(sdkMts) && (await fs.unlink(sdkMts));
  await generateSdkMts();

  const autogeneratedMsg = '/* The next code is autogenerated from sdk.mjs */';
  const newSdkTsContent =
    (await fs.readFile(sdkTs, 'utf-8')).split(autogeneratedMsg)[0] +
    `${autogeneratedMsg}\n\n${await fs.readFile(sdkMts, 'utf-8')}`;

  await fs.writeFile(sdkTs, newSdkTsContent);
  await fs.unlink(sdkMts);

  try {
    execSync('npx prettier -w sdk.d.ts');
  } catch (error) {
    console.log(
      `Error ${error.status} executing Prettier` +
        ` to pretiffy SDK TS definitions: '${error.message}'`,
    );
    process.exit(1);
  }
};

await generateSdkTs();
