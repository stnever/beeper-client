var _ = require('lodash'),
    util = require('util'),
    Promise = require('bluebird'),
    join = require('url').resolve,
    moment = require('moment'),
    prequest = require('prequest');

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

  return prequest({
    url: this.endpoint,
    qs: strParams,
    headers: this.opts.headers
  })
}

Resource.prototype.find = function(id) {
  return prequest({
    url: join(this.endpoint, id),
    headers: this.opts.headers
  })
}

Resource.prototype.save = function(id, obj) {
  console.log('saving', obj, this)

  if ( _.isPlainObject(id) ) {
    obj = id
    id = obj.id
  }

  if ( id == null ) {
    return prequest({
      method: 'POST', url: this.endpoint, body: obj,
      headers: this.opts.headers
    })
  } else {
    return prequest({
      method: 'PUT', url: join(this.endpoint, id), body: obj,
      headers: this.opts.headers
    })
  }
}

Resource.prototype.patch = function(id, what) {
  return prequest({
    method: 'PATCH',
    url: join(this.endpoint, id),
    body: what,
    headers: this.opts.headers
  })
}

Resource.prototype.delete = function(obj) {
  var id = _.isPlainObject(obj) ? obj.id : obj;
  return prequest({
    method: 'DELETE',
    url: join(this.endpoint, id),
    headers: this.opts.headers
  })
}