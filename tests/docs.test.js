import {strict as assert} from 'node:assert';
import {test} from 'mocha';
import {getThirdPartyExtensions} from '../sdk.mjs';

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
