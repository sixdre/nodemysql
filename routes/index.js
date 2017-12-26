"use strict";
import apiRouter from './api'
import RateLimit from 'express-rate-limit'

//限制api 的请求次数
var apiLimiter = new RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20,
	delayMs: 0, // disabled
//	keyGenerator:function(req){
//		console.log(req.ip)
//	}
});

export default app => {
	app.use('/api',apiRouter);
	app.get('/',function(req,res,next){
		res.render('index')
	});
}