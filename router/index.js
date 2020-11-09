const KoaRouter = require('koa-router');
const Fly = require("flyio/src/node")
const jwt = require('jsonwebtoken');
const test = require('./post.js')
const mysql = require('../mysql')
const session_user = require("../session");
const fly = new Fly;


const router = new KoaRouter();

// 获得读书页右侧热门分类 
const bookHotList = require('../datas/bookHotTag.json')
router.get('/getBookHotList', ctx => {
	ctx.body = bookHotList
})

// 获取新书速递数据
const newBooksList = require('../datas/booksInfo.json')
router.get('/getNewsBooksList', ctx => {
	ctx.body = newBooksList
})

//获得某个新书的数据
router.get('/getNewsBooksList/:id', ctx => {
	let booksInfo = newBooksList.find(item => {
		return item.id === +ctx.params.id
	})
	if (booksInfo) {
		ctx.body = {
			code: 2000,
			data: booksInfo
		}
	} else {
		ctx.body = {
			code: 2001,
			data: {}
		}
	}

})

//获取同城页面的数据
const commonCityData = require('../datas/commonCity.json')
router.get('/commonCityData', (ctx, next) => {
	ctx.body = commonCityData
})


// 获取同城演出详情的数据
const commonCityShowDetail = require('../datas/commonCityShowDetail.json')
router.get('/commonCity', ctx => {
	let id = ctx.request.query.id;
	if(id === '1'){
		let result = commonCityShowDetail.slice(0,1) 
		ctx.body = result;
	}else if(id === '2'){
		let result = commonCityShowDetail.slice(1,2) 
		ctx.body = result; 
	}else if(id === '101'){
		let result = commonCityShowDetail.slice(3,4) 
		ctx.body = result; 
	}else if(id === '102'){
		let result = commonCityShowDetail.slice(4,5) 
		ctx.body = result;  
	}else if(id === '103'){
		let result = commonCityShowDetail.slice(5,6) 
		ctx.body = result; 
	}else {
		let result = commonCityShowDetail.slice(2,3)
		ctx.body = result;
	}    
})

router.get('/test', (ctx, next) => {
	ctx.body = "测试test接口"
})

//验证码过期时间
const PHONE_EXPIRES = 60 * 1000;
//cookie过期时间(7天免登录)
const COOKIE_MAX_AGE = 7 * 24 * 3600 * 1000;

function getVerifyCode(len = 6) {
	let verify_code = "";
	for (let i = 0; i < len; i++) {
		verify_code += Math.floor(Math.random() * 10);
	}
	return verify_code;
}


//音乐页面
// 本周流行音乐人
const imgMusicImgList = require('../datas/musicPopular.json')
router.get('/getmusicImgList', ctx => {
	ctx.body = imgMusicImgList
})

// 新碟榜
const albumImgList = require('../datas/musicAlbum.json')
router.get('/getalbumImgList', ctx => {
	ctx.body = albumImgList
})

const musicRank = require('../datas/musicRank.json')
router.get('/getmusicRank', ctx => {
	ctx.body = musicRank
})


//手机验证码
router.post('/digits', ctx => {
	let {
		phone
	} = ctx.request.body
	const verify_code = getVerifyCode(6);
	console.log('验证码为：' + verify_code);
	session_user[phone] = {
		code: verify_code,
		expires: Date.now() + PHONE_EXPIRES,
	};

	ctx.body = {
		code: 2000,
		message: '获取验证码成功'
	}
})

//手机验证码登录
router.post('/getVerifyUserCode', async ctx => {
	let {
		telephone,
		code
	} = ctx.request.body
	let session_code = session_user[telephone]
	if (session_code && session_code.code === code) {
		let result = await mysql.queryByTelePhone({
			telephone
		})
		console.log(result);
		if (result.length > 0) {
			ctx.body = {
				code: 2000,
				data: result[0],
				message: '登录成功'
			}
		} else {
			ctx.body = {
				code: 2000,
				data: {
					username: '游客',
					telephone: ''
				},
				message: '登录成功'
			}
		}
	} else {
		ctx.body = {
			code: 2001,
			data: {},
			message: '验证码错误'
		}
	}

})

//用户名密码
router.post('/getVerifyUser', async ctx => {
	console.log(ctx.request.body)
	let { telephone,password} = ctx.request.body
	let result = await mysql.query({telephone,password})
	console.log(result);
	if (result.length > 0) {
		ctx.body = {
			code: 2000,
			data: result[0],
			message: '登录成功'
		}
	} else {
		ctx.body = {
			code: 2001,
			data: {},
			message: '登录失败'
		}
	}
})



//豆品下全部商品的数据接口
const allShopDataList = require('../datas/allShopData.json');
router.get('/getAllShopDataList', (ctx) => {
	ctx.body = allShopDataList;
});


//豆品主页的数据接口
const maindoupinDataList = require('../datas/maindoupinData.json');
router.get('/getMaindoupinDataList', (ctx) => {
	ctx.body = maindoupinDataList;
});


// 电影
// 获取热门电影
const movieHot = require('../datas/movie/movies/movieHot.json')
  router.get('/getMovieHot',(ctx) => {
    ctx.body=movieHot
})

// 获取最新电影
const movieNew = require('../datas/movie/movies/movieNew.json')
  router.get('/getMovieNew',(ctx) => {
    ctx.body=movieNew
})

// 获取豆瓣高分电影
const movieHigh = require('../datas/movie/movies/movieHigh.json')
  router.get('/getMovieHigh',(ctx) => {
    ctx.body=movieHigh
})

// 获取冷门佳片电影
const movieCold = require('../datas/movie/movies/movieCold.json')
  router.get('/getMovieCold',(ctx) => {
    ctx.body=movieCold
})

// 获取华语电影
const movieCh = require('../datas/movie/movies/movieCh.json')
  router.get('/getMovieCh',(ctx) => {
    ctx.body=movieCh
})

// 获取欧美电影
const movieEur = require('../datas/movie/movies/movieEur.json')
  router.get('/getMovieEur',(ctx) => {
    ctx.body=movieEur
})

// 获取韩国电影
const movieKor = require('../datas/movie/movies/movieKor.json')
  router.get('/getMovieKor',(ctx) => {
    ctx.body=movieKor
})

// 获取日本电影
const movieJan = require('../datas/movie/movies/movieJan.json')
  router.get('/getMovieJan',(ctx) => {
    ctx.body=movieJan
})

// 标签
// 获取电影标签
const movieTag = require('../datas/movie/tags/movieTag.json')
  router.get('/getMovieTag',(ctx) => {
    ctx.body=movieTag
})
// 获取电视标签
const tvTag = require('../datas/movie/tags/tvTag.json')
  router.get('/getTvTag',(ctx) => {
    ctx.body=tvTag
})
// 获取标签
const tag = require('../datas/movie/tags/tag.json')
  router.get('/getTag',(ctx) => {
    ctx.body=tag
})

// 电视
// 热门
const tvHot = require('../datas/movie/tvs/tvHot.json')
  router.get('/getTvHot',(ctx) => {
    ctx.body=tvHot
})

// 国产剧
const tvCh = require('../datas/movie/tvs/tvCh.json')
  router.get('/getTvCh',(ctx) => {
    ctx.body=tvCh
})

// 综艺
const tvZh = require('../datas/movie/tvs/tvZh.json')
  router.get('/getTvZh',(ctx) => {
    ctx.body=tvZh
})

// 美剧
const tvTus = require('../datas/movie/tvs/tvTus.json')
  router.get('/getTvTus',(ctx) => {
    ctx.body=tvTus
})

// 日剧
const tvJan = require('../datas/movie/tvs/tvJan.json')
  router.get('/getTvJan',(ctx) => {
    ctx.body=tvJan
})

// 韩剧
const tvKor = require('../datas/movie/tvs/tvKor.json')
  router.get('/getTvKor',(ctx) => {
    ctx.body=tvKor
})

// 日本动画
const tvAni = require('../datas/movie/tvs/tvAni.json')
  router.get('/getTvAni',(ctx) => {
    ctx.body=tvAni
})

// 纪录片
const tvRec = require('../datas/movie/tvs/tvRec.json')
  router.get('/getTvRec',(ctx) => {
    ctx.body=tvRec
})

module.exports = router