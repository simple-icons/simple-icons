const { reporters, Runner } = require('mocha');

const { EVENT_RUN_END } = Runner.constants;

class EvenMoreMin extends reporters.Base {
  constructor(runner) {
    super(runner);
    runner.once(EVENT_RUN_END, () => this.epilogue());
  }
}

module.exports = EvenMoreMin;
