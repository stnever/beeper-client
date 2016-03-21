var BeeperClient = require('./beeper-client'),
    bc = new BeeperClient({host: 'http://localhost:4444'}),
    Promise = require('bluebird'),
    _ = require('lodash'),
    paramParser = require('param-parser')


// bc.Account.save({code: 'stnever@hlg'}).then(function() {
//   return bc.Account.findAll()
// }).then(console.log)

function b(source, contents, to, tags) {
  return bc.postBeep({
    source: source,
    contents: contents,
    tags: tags,
    data: {
      recipients: _.isArray(to) ? to : [to]
    }
  }).catch(function(err) {
    console.log(err)
  })
}

function log(rows) {
  console.log(JSON.stringify(rows, null, ' '))
}

Promise.all([
  b('hlg', 'veículo 123 chegou em poly 456', 'stnever@hlg', ['arrival']),
  b('hlg', 'veículo 123 saiu do poly 456', 'stnever@hlg', ['departure']),
  b('exemplo', 'manutenção se aproximando para o veículo 123', 'admin@exemplo', ['maintenace']),
  b('exemplo', 'erro de rawdata', 'stnever@exemplo', ['error']),
  b('novorumo', 'veículo 123 está atrasado 456', ['alice@hlg', 'bob@hlg'], ['lateness']),
  b('hlg', 'veículo 123 chegou em poly 456', 'stnever@hlg', ['arrival'])
]).then(function() {
  return bc.Beep.findAll().tap(log)
})

// var where = paramParser.common()(paramParser.cli())
// console.log(where)
// bc.Beep.findAll(where).then(log)