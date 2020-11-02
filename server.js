const koa = require('koa')
const router = require('./router/index.js')
const app = new koa()

app
	.use(router.routes())
	.use(router.allowedMethods())



app.listen('3001', (err) => {
	if (err) {
		console.log(err)
		return
	}
	console.log('服务器启动成功')
	console.log('http://localhost:30001')
})
