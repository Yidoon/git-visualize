const koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')()
const api = require('./router/index')
const config = require('./config')
const app = new koa()

app.use(logger())
const index = router.get('/', ctx => {
    ctx.response.body = 'hello world!'
}).routes()


app.use(index)
app.use(bodyParser())
app.use(api.routes())

app.listen(config.port)