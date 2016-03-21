var _ = require('lodash'),
    util = require('util'),
    Promise = require('bluebird'),
    Resource = require('./resource');

function join(a, b) {
  return _.trimRight(a, '/') + '/' + _.trimLeft(b, '/')
}

var BeeperClient = module.exports = function BeeperClient(opts) {
  if ( opts.host == null )
    throw new Error('Missing beeper host')

  _.assign(this, opts);

  var headers = {access_token: this.token}

  this.Beep = new Resource(join(this.host, 'api/beeps'), headers)
  this.Account = new Resource(join(this.host, 'api/accounts'), headers)
  this.Source = new Resource(join(this.host, 'api/sources'), headers)
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