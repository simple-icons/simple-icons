/**
 * @file Custom mocha reporter.
 *
 * Serves to clear the console after the test run is finished.
 * See {@link https://github.com/mochajs/mocha/issues/2312}.
 */

const {reporters, Runner} = require('mocha');

const {EVENT_RUN_END} = Runner.constants;

class EvenMoreMin extends reporters.Base {
  /**
   * Construct a new `EvenMoreMin` reporter.
   * @param {import('mocha').Runner} runner Mocha test runner.
   */
  constructor(runner) {
    super(runner);
    runner.once(EVENT_RUN_END, () => {
      // TODO: mocha's base reporters are not typed
      // @ts-ignore
      return this.epilogue();
    });
  }
}

module.exports = EvenMoreMin;
