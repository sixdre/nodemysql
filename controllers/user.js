import validator from 'validator'
import Sequelize from 'sequelize'
import {UserModel,RoleModel,PermissionModel,MenuModel} from '../models/'
import transformTozTreeFormat from '../utility/tree'

const Op = Sequelize.Op;

class UsersController {
	//查询所有
	async getUsers(req,res,next){
		try{
			let users = await UserModel.findAll();
				users = JSON.parse(JSON.stringify(users));
			let Pro = users.map(item=>{
				return new Promise((resolve, reject) => {
					return  RoleModel.findById(item.roleId).then(re=>{
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
	
	//获取当前登录用户信息
	async getUserInfo(req,res,next){
		let roleId = req.userInfo.roleId;
		if(!roleId){
			return res.json({
				code:1,
				data:[]
			})
		}
		try{
			let role = await RoleModel.findById(roleId);
			if(!role){
				return res.json({
					code:1,
					data:[]
				})
			}
			let {permission} = role;
			let data=[];
			
			if(permission){
				permission = permission.split(',');
				let menuList= await MenuModel.findAll({
					where: {
					    id: {
					      [Op.in]: permission
					    }
					},
					raw:true
				})
				data = transformTozTreeFormat(menuList);
			}
			res.json({
				code:1,
				msg:'角色权限获取成功',
				data
			})

		}catch(err){
			
		}
	}

	//创建用户
	async createUser(req,res,next){
		let {username,password,roleId} = req.body;
		try{
			if(validator.isEmpty(username)||validator.isEmpty(password)){
				return res.json({
					code:0,
					msg:'用户名密码不得为空'
				})
			}
			let user = await UserModel.findOne({where:{username:username}});
			if(user){
				return res.json({
					code:0,
					msg:'该用户名已存在'
				})
			}
			await UserModel.create({
				username,
				password,
				roleId
			});
			res.json({
				code:1,
				msg:'用户创建成功'
			})
		}catch(err){
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
