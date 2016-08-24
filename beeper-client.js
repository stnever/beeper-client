var _ = require('lodash'),
    util = require('util'),
    Promise = require('bluebird'),
    Resource = require('./resource'),
    debug = require('debug')('beeper-client'),
    prequest = require('prequest');

function join(a, b) {
  return _.trimRight(a, '/') + '/' + _.trimLeft(b, '/')
}

var BeeperClient = module.exports = function BeeperClient(opts) {
  if ( opts.host == null )
    throw new Error('Missing beeper host')

  _.assign(this, opts);

  var headers = {access_token: this.token}

  this.Beep = new Resource(join(this.host, 'api/beeps'), {
    headers: headers
  })

  this.Account = new Resource(join(this.host, 'api/accounts'), {
    headers: headers, idProp: 'code'
  })

  this.Source = new Resource(join(this.host, 'api/sources'), {
    headers: headers, idProp: 'code'
  })

  this.whoami = function() {
    var opts = {
      url: join(this.host, 'api/oauth/whoami'),
      headers: headers
    }
    debug('About to GET %s', opts.url)
    return prequest(opts)
  }
}

BeeperClient.prototype.postBeep = function(beep) {
  var me = this
  return Promise.try(function() {
    var body = preProcess(beep)
    return me.Beep.save(body)
  })
}

BeeperClient.prototype.postBulk = function(beeps) {
  var me = this
  return Promise.try(function() {
    var body = beeps.map(preProcess)
    return me.Beep.save(body)
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

  return _.pick(beep, 'source', 'contents', 'tags', 'data')
}
