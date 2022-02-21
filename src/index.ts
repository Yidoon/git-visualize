import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { PORT } from './config'
import api from './router'
import AppRoutes from './routes'

const app = new Koa()
const router = new Router()

console.log(PORT, 'PORT')

// router
AppRoutes.forEach((route) => router[route.method](route.path, route.action))

app.use(bodyParser())
// app.use(router.routes())
// app.use(router.allowedMethods())
app.use(api.routes())
app.use(api.allowedMethods())
app.listen(PORT)

console.log(`应用启动成功 端口:${PORT}`)
