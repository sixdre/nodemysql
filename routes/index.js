"use strict";
import userRouter from './user'

export default app => {

	app.use('/users',userRouter);

}
