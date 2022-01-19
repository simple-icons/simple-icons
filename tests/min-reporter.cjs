const { reporters } = require('mocha');

class EvenMoreMin extends reporters.Base {
  constructor(runner) {
    super(runner);
    runner.once('end', () => this.epilogue());
  }
}

module.exports = EvenMoreMin;
