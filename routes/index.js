"use strict";
import userRouter from './user'
import permissionRouter from './permission'
import apiRouter from './api'
import auth from '../middleware/auth'

export default app => {
	
	app.use('/api',apiRouter);
	app.use('/users',auth.checkToken,userRouter);
	app.use('/permission',auth.checkToken,permissionRouter);
}
