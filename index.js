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
  return function *(next) {
    var token = this[tokenProp] || options.token
    // verify signatures
    if (!wechat.checkSignature(token, this.query)) {
      this.throw(401)
    }
    if (this.method == 'GET') {
      this.body = this.query.echostr
      return
    }

    // parse request xml
    this.req.body = yield parse

    // set sessionId if neccessary
    if (options.session !== false) {
      Object.defineProperty(this, 'sessionId', { value: generateSid(this.req.body) })
    }

    // run other middlewares
    yield next
    // output
    this.type = 'application/xml'
    this.body = wechat.dump(this.body)
  }
}
