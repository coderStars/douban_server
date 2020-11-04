const app = require('koa')
const KoaRouter = require('koa-router');
const Fly = require("flyio/src/node")
const jwt = require('jsonwebtoken');
const fly=new Fly;

const router = new KoaRouter();

router.get('/test',(ctx,next) => {
	ctx.body="测试test接口"
})


//电影页面
// 本周流行音乐人
const imgMusicImgList = require('../datas/musicPopular.json')
router.get('/getmusicImgList',ctx => {
	ctx.body = imgMusicImgList
})

// 新碟榜
const albumImgList = require('../datas/musicAlbum.json')
router.get('/getalbumImgList',ctx => {
	ctx.body = albumImgList
})


router.get('/getOpenId',async ctx => {
	let code = ctx.query.code
	let appId = 'wx809f5e54ada35dc0'
	let appSecert = '69fc6ba6279e282f2ac01147756e9b3c'
	
	let result = await fly.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecert}&js_code=${code}&grant_type=authorization_code`)
	
	let body = JSON.parse(result.response.body)
	let openId = body.openid
	let token = jwt.sign(openId, 'atguigu');
	ctx.body = token
	
})
module.exports = router