const app = require('koa')
const KoaRouter = require('koa-router');
const Fly = require("flyio/src/node")
const jwt = require('jsonwebtoken');
const test = require('./post.js')
const mysql = require('../mysql')
const session_user = require("../session");
const fly=new Fly;

const router = new KoaRouter();


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


//手机验证码
router.post('/digits',ctx => {
	let {phone} = ctx.request.body
	const verify_code = getVerifyCode(6);
  console.log('验证码为：'+verify_code);
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
	let {telephone,code} = ctx.request.body
	let session_code = session_user[telephone]
	if(session_code && session_code.code === code) {
		let result = await mysql.queryByTelePhone({telephone})
		console.log(result);
		if(result.length > 0) {
			ctx.body = {
				code:2000,
				data: result[0],
				message: '登录成功'
			}
		}else {
			ctx.body = {
				code:2001,
				data: {username: '游客',telephone: ''},
				message: '登录成功'
			}
		}
	}else {
		ctx.body = {
			code:2001,
			data: {},
			message: '验证码错误'
		}
	}
	
})

//用户名密码
router.post('/getVerifyUser',async ctx => {
	console.log(ctx.request.body)
	let {telephone,password} = ctx.request.body
	let result = await mysql.query({telephone,password})
	console.log(result);
	if(result.length > 0) {
		ctx.body = {
			code:2000,
			data: result[0],
			message: '登录成功'
		}
	}else {
		ctx.body = {
			code:2001,
			data: {},
			message: '登录失败'
		}
	}
})

module.exports = router