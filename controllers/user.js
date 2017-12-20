import validator from 'validator'
import Sequelize from 'sequelize'
import {UserModel,RoleModel,MenuModel} from '../models/'
import transformTozTreeFormat from '../utility/tree'

const Op = Sequelize.Op;

class UsersController {
	//查询所有
	async getUsers(req,res,next){
		let {page=1,limit=5,group=0} = req.query;
			page = Number(page),
			limit = Number(limit);
		try{
			let results = await UserModel.findAndCountAll({
				attributes:['id','username','roleId','createdAt','updatedAt'],
				limit: limit,
				offset: (page-1)*limit,
				raw:true
			});
			let users = results.rows;
			let count = results.count;
			
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
				data,
				count
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
			let {menuIds} = role;
			let data=[];
			
			if(menuIds){
				menuIds = menuIds.split(',');
				let menuList= await MenuModel.findAll({
					where: {
					    id: {
					      [Op.in]: menuIds
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
