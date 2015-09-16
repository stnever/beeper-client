var BeeperClient = require('../beeper-client.js');

describe('BeeperClient', function() {

  it('should beep', function() {
    return new BeeperClient({
      host: 'http://localhost:4444'
    }).postBeep({
      source: 'unittest/src1',
      contents: 'Mensagem Teste'
    })
  })

})