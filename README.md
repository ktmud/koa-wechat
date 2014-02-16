# koa-wechat

Wechat Official Account API (微信公众平台API) middleware for [koajs](http://koajs.com)


## Usage

```javascript
var app = require('koa')()
var wechat = require('koa-wechat')

app.use(wechat({ token: 'wechat_token' }))
```

## options.token

Token assigned to wechat API.


## options.tokenProp

Find the token from a `ctx` property, i.e., `this[tokenProp]`

## options.session

By default, koa-wechat will set a `this.sessionId` to identify (a offical account + a subscriber)
as an unique session. Then you can safely use `koa-session` middleware to save an subscriber's session.
You can set `options.session` to `false` to disable this behavior.
