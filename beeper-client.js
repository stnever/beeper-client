var _ = require('lodash'),
    util = require('util'),
    Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request'));

var BeeperClient = module.exports = function BeeperClient(opts) {
  _.assign(this, opts);
}

BeeperClient.prototype.postBeep = function(opts) {
  if ( this.host == null ) return Promise.reject('Missing beeper host');
  if ( opts.source == null || opts.source.length < 1 )
    return Promise.reject('Missing beep source');

  if ( opts.contents == null || opts.contents.length < 1 )
    return Promise.reject('Missing beep contents');
  if ( opts.ps ) {
    opts.contents = util.format.apply(null, [opts.contents].concat(opts.ps));
  }

  return request.postAsync({
    method: 'POST',
    uri: this.host + '/api/beeps',
    headers: {
      access_token: this.token
    },
    json: true,
    body: _.pick(opts, 'source', 'contents', 'data')
  }).spread(function(res, body) {
    if ( res.statusCode != 200 ) {
      throw new Error('Bad response from BeeperServer: ' +
        res.statusCode + ' ' + atMost(body, 100));
    }

    return body;
  });
}

function atMost(s, limit) {
  if ( !_.isString(s) )
    s = JSON.stringify(s);

  if ( s == null || s.length < limit ) return s;
  return s.substring(0, limit) + '... (' + s.length + ' chars)';
}
