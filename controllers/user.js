import UserModel from '../models/user'

class UsersController {
	//查询所有
	async getUsers(req,res,next){
		try{
			let data = await UserModel.findOne();
			res.json({
				data
			})
		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}

	
}



export default new UsersController();
