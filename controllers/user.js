import {UserModel,RoleModel,PermModel,MenuModel} from '../models/'
import permissionCtrl from '../controllers/permission'
import Sequelize from 'sequelize'
const Op = Sequelize.Op;

class UsersController {
	//查询所有
	async getUsers(req,res,next){
		try{
			let data = await UserModel.findAll();
			res.json({
				code:1,
				data
			})
		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}
	
	async login(req,res,next){
		let {username,password} = req.body;
		if(!username||!password){
			res.json({
				code:-1,
				msg:'参数错误'
			})
		}

		let user =  await UserModel.findOne({where: {username: username}})
		if(!user){
			res.json({
				code:0,
				msg:'该用户不存在'
			})
		}else if(user.password!==password){
			res.json({
				code:0,
				msg:'密码错误'
			})
		}else{
			let data = await permissionCtrl.getPermissionByRoleId(user.roleId);
			res.json({
				code:1,
				msg:'登录成功',
				data:data.data,
				ids:data.ids,
				role:user.roleId,
				token:(new Date().getTime())/1000
			})
		}
	}
	
}



export default new UsersController();
