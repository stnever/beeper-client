var _ = require('lodash'),
    BeeperClient = require('../beeper-client.js'),
    client = new BeeperClient({
      host: 'http://localhost:4444'
    });

module.exports = function beep(source, contents) {
  return client.postBeep({
    source: source,
    contents: contents,
    ps: _.slice(arguments, 2)
  })
}