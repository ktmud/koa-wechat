# koa-wechat

Wechat Official Account API (微信公众平台API) middleware for [koajs](http://koajs.com)


## Usage

```javascript
var app = require('koa')()
var wechat = require('koa-wechat')

app.use(wechat({ token: 'wechat_token' }))
```

To use this with `weixin-robot`:

```
// Get the robot
app.use(function *(next) {
  var media_id = this.path.split('/')[1]
  if (!media_id) {
    this.throw(404)
  }
  var webot = yield Webot.get(media_id)
  if (!webot) {
    this.throw(404)
  }
  this.webot = webot
  this.wx_token = webot.wx_token
  yield next
})

app.use(wechat())
app.use(session({ store: redisc('webot:session:') }))

// do the reply
app.use(function *(next) {
  var info = this.req.body
  info.session = this.session
  this.body = yield this.webot.reply(info)
  yield next
})

// an empty handler to prevent any following middlewares
app.use(wechat.close())

```

## options.token

Token assigned to wechat API.


## options.tokenProp

Find the token from a `ctx` property, i.e., `this[tokenProp]`


## options.checksig

Whether we need to check signature or not, default to `true`.


## options.session

By default, koa-wechat will set a `this.sessionId` to identify (a offical account + a subscriber)
as an unique session. Then you can safely use `koa-session` middleware to save an subscriber's session.
You can set `options.session` to `false` to disable this behavior.
