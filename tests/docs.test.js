/**
 * @file Tests for the documentation.
 */

import {strict as assert} from 'node:assert';
import {test} from 'mocha';
import {getThirdPartyExtensions, getThirdPartyLibraries} from '../sdk.mjs';

test('README third party extensions must be alphabetically sorted', async () => {
  const thirdPartyExtensions = await getThirdPartyExtensions();
  assert.ok(thirdPartyExtensions.length > 0);

  const thirdPartyExtensionsNames = thirdPartyExtensions.map(
    (extension) => extension.module.name,
  );

  const expectedOrder = [...thirdPartyExtensionsNames].sort();
  assert.deepEqual(
    thirdPartyExtensionsNames,
    expectedOrder,
    'Wrong alphabetical order of third party extensions in README.',
  );
});

test('README third party libraries must be alphabetically sorted', async () => {
  const thirdPartyLibraries = await getThirdPartyLibraries();
  assert.ok(thirdPartyLibraries.length > 0);

  const thirdPartyLibrariesNames = thirdPartyLibraries.map(
    (library) => library.module.name,
  );

  const expectedOrder = [...thirdPartyLibrariesNames].sort();
  assert.deepEqual(
    thirdPartyLibrariesNames,
    expectedOrder,
    'Wrong alphabetical order of third party libraries in README.',
  );
});
