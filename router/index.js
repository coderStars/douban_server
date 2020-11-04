const KoaRouter = require('koa-router');
const Fly = require("flyio/src/node")
const jwt = require('jsonwebtoken');
const fly=new Fly;

const router = new KoaRouter();

// 获取电影接口参数
const moviesData = require('../datas/movies.json')
router.get('/getMoviesData',(ctx,moviesData) => {
	ctx.body=moviesData
})

// 获取电影tags参数
const mvKindsData = require('../datas/mvKinds.json')
router.get('/getMvKindsData',(ctx,mvKindsData) => {
	ctx.body=mvKindsData
})

// 获取点数据tags参数
const tvsData = require('../datas/Tvs.json')
router.get('/getI',(ctx,tvsData) => {
	ctx.body=tvsData
})

router.get('/test',(ctx,next) => {
	ctx.body="测试test接口"
})


//首页接口
const indexData = require('../datas/index.json')
router.get('/getIndexData',(ctx) => {
	ctx.body = indexData
})

const cateData = require('../datas/categoryDatas.json')
router.get('/getCateGoryData',ctx => {
	ctx.body = cateData
})

const indexCategoryList = require('../datas/indexCateList.json')
router.get('/getIndexCateListData',ctx => {
	ctx.body = indexCategoryList
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