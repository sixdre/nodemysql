"use strict";
import userRouter from './user'
import permissionRouter from './permission'
import apiRouter from './api'
export default app => {
	
	app.use('/api',apiRouter);
	app.use('/users',userRouter);
	app.use('/permission',permissionRouter);
}
