var _ = require('lodash'),
    util = require('util'),
    Promise = require('bluebird'),
    moment = require('moment'),
    debug = require('debug')('beeper-client')
    prequest = require('prequest');

function join(a, b) {
  return _.trimRight(a, '/') + '/' + _.trimLeft(b, '/')
}

function logQs(obj) {
  if ( obj == null || Object.keys(obj).length < 1 ) return '';
  return _.reduce(obj, function(acc, val, key) {
    if ( _.isDate(val) ) val = moment(val).format()
    acc.push(key + '=' + val)
    return acc
  }, []).join(' ')
}

function go(opts) {
  debug('About to %s %s %s', opts.method || 'GET',
    opts.url, logQs(opts.qs))
  return prequest(opts)
}

var Resource = module.exports = function Resource(endpoint, opts) {
  this.opts = opts || {}
  this.endpoint = endpoint
}

Resource.prototype.findAll = function(params) {
  var strParams = _.mapValues(params, function(val, key) {
    if ( _.isPlainObject(val) ) return JSON.stringify(val);
    if ( _.isDate(val) ) return moment(val).format();
    return '' + val
  })

  return go({
    url: this.endpoint,
    qs: strParams,
    headers: this.opts.headers
  })
}

Resource.prototype.find = function(id) {
  return go({
    url: join(this.endpoint, id),
    headers: this.opts.headers
  })
}

Resource.prototype.save = function(id, obj) {

  if ( _.isPlainObject(id) ) {
    var idProp = this.opts.idProp || 'id'
    obj = id
    id = obj[idProp]
  }

  if ( id == null ) {
    return go({
      method: 'POST', url: this.endpoint, body: obj,
      headers: this.opts.headers
    })
  } else {
    return go({
      method: 'PUT', url: join(this.endpoint, id), body: obj,
      headers: this.opts.headers
    })
  }
}

Resource.prototype.patch = function(id, what) {
  return go({
    method: 'PATCH',
    url: join(this.endpoint, id),
    body: what,
    headers: this.opts.headers
  })
}

Resource.prototype.delete = function(obj) {

  var id = obj
  if ( _.isPlainObject(obj) ) {
    var idProp = this.opts.idProp || 'id'
    id = obj[idProp]
  }

  return go({
    method: 'DELETE',
    url: join(this.endpoint, id),
    headers: this.opts.headers
  })
}