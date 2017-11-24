import {UserModel} from '../models/'

class UsersController {
	//查询所有
	async getUsers(req,res,next){
		try{
			let data = await UserModel.findAll();
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
