#!/usr/bin/env node

var _ = require('lodash'),
    BeeperClient = require('../beeper-client'),
    repl = require('repl');

var host = process.argv[2] || 'http://localhost:4444'

console.log('variables:')
console.log('  l      => lodash')
console.log('  moment => moment')
console.log('  bc     => BeeperClient at ' + host)
console.log('  j      => logs JSON.stringify')
console.log('  jp     => logs JSON.stringify pretty')

var replServer = repl.start({
  prompt: "> "
});

_.assign(replServer.context, {
  l: _,
  moment: require('moment'),
  bc: new BeeperClient({host: host}),
  j: function(o) { console.log(JSON.stringify(o)) },
  jp: function(o) { console.log(JSON.stringify(o, null, ' ')) }
})