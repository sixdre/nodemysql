"use strict";
import userRouter from './user'
import permissionRouter from './permission'

export default app => {

	app.use('/users',userRouter);
	app.use('/permission',permissionRouter);
}
