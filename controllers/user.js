import {UserModel,RoleModel,PermPathModel,MenuModel} from '../models/'
import permissionCtrl from '../controllers/permission'
import Sequelize from 'sequelize'
import auth from '../middleware/auth'
const Op = Sequelize.Op;

class UsersController {
	//查询所有
	async getUsers(req,res,next){
		try{
			let users = await UserModel.findAll();
				users = JSON.parse(JSON.stringify(users));
			let Pro = users.map(item=>{
				return new Promise((resolve, reject) => {
					return  RoleModel.findOne({
					  	where: {
					    	id: item.roleId
					  	}
					}).then(re=>{
						if(re){
							item.roleName = re.name;
							item.roleSuper = re.super;
						}else{
							item.roleName = null;
						}
						resolve(item)
					}).catch(err=>{
						reject(err)
					})
				})
			})

			let data = await Promise.all(Pro);
			res.json({
				code:1,
				data
			})

		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}
	
	async updateUserRole(req,res,next){
		let {userId,roleId} = req.body;
		if(!userId){
			res.json({
				code:0,
				msg:'参数缺失'
			})
		}
		try{
			await UserModel.update({roleId:roleId},{where:{id: userId}});
			res.json({
				code:1,
				msg:'用户角色分配成功'
			})
		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}

	
}



export default new UsersController();
