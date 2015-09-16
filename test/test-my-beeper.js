var beep = require('../examples/my-beeper.js');

describe('My Beeper', function() {
  it('should beep more easily', function() {
    return beep('source1', 'msg: %s of %s', 1, 4)
  })
})