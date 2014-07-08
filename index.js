var wechat = require('wechat-mp')

/**
 * Wrap the wechat parse request method
 */
function parse(req) {
  return function(next) {
    wechat.parse(req, next)
  }
}

/**
 * generate a session id
 */
function generateSid(data) {
  return ['wx', data.sp, data.uid].join('.')
}

/**
 * Handle request from wechat server.
 *
 * check signature, assign sessionId, make response
 */
module.exports = function(options) {
  options = options || { tokenProp: 'wx_token' }
  var tokenProp = options.tokenProp
  var checksig = 'checksig' in options ? options.checksig : true
  return function *(next) {
    var token = tokenProp && this[tokenProp] || options.token
    // verify signatures
    if (checksig && !wechat.checkSignature(token, this.query)) {
      this.throw(401, 'Invalid signature')
    }
    if (this.method == 'GET') {
      this.body = this.query.echostr
      return
    }

    // parse request xml
    this.req.body = yield parse(this.req)

    // set sessionId if neccessary
    if (options.session !== false) {
      var sid = generateSid(this.req.body)
      // always return the same sessionId
      Object.defineProperty(this, 'sessionId', {
        get: function() { return sid },
        set: function(){ }
      })
    }
    // run other middlewares
    yield next
    // output
    this.type = 'application/xml'
    this.body = wechat.dump(wechat.ensure(this.body, this.req.body))
  }
}

module.exports.parse = parse

/**
 * To close the request, stop runs any `next` actions
 */
module.exports.close = function() {
  return function *() { }
}
