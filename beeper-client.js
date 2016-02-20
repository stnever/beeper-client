var _ = require('lodash'),
    util = require('util'),
    Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request'));

var BeeperClient = module.exports = function BeeperClient(opts) {
  _.assign(this, opts);
}

BeeperClient.prototype.postBeep = function(beep) {
  var me = this
  return Promise.try(function() {
    var body = preProcess(beep)
    return me.doPost(body)
  })
}

BeeperClient.prototype.postBulk = function(beeps) {
  var me = this
  return Promise.try(function() {
    var body = beeps.map(preProcess)
    return me.doPost(body)
  })
}

BeeperClient.prototype.doPost = function(body) {
  if ( this.host == null )
    throw new Error('Missing beeper host')

  return request.postAsync({
    method: 'POST',
    uri: this.host + '/api/beeps',
    headers: {
      access_token: this.token
    },
    json: true,
    body: body
  }).spread(function(res, body) {
    if ( res.statusCode != 200 ) {
      throw new Error('Bad response from BeeperServer: ' +
        res.statusCode + ' ' + atMost(body, 100));
    }

    return body;
  })
}

function validate(beep) {
  if ( beep.source == null || beep.source.length < 1 )
    throw new Error('Missing beep source')

  if ( beep.contents == null || beep.contents.length < 1 )
    throw new Error('Missing beep contents')
}

function preProcess(beep) {
  validate(beep)

  if ( beep.ps )
    beep.contents = util.format.apply(null,
      [beep.contents].concat(beep.ps) )

  return _.pick(beep, 'source', 'contents', 'data')
}

function atMost(s, limit) {
  if ( !_.isString(s) )
    s = JSON.stringify(s);

  if ( s == null || s.length < limit ) return s;
  return s.substring(0, limit) + '... (' + s.length + ' chars)';
}
