const koa = require('koa')
const router = require('./router/index.js')
const app = new koa()
const bodyParser = require('koa-bodyparser');

app
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())



app.listen('3000', (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log('服务器启动成功')
	console.log('http://localhost:3000')
})
