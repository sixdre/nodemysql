import validator from 'validator'
import Sequelize from 'sequelize'
import crypto from "crypto"
import {UserModel,RoleModel,MenuModel,PermissionModel} from '../models/'
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
		let userInfo = {
			id:req.userInfo.id,
			username:req.userInfo.username,
			roleId:req.userInfo.roleId,
			roleName:req.userInfo.roleName
		}
		if(!roleId){
			return res.json({
				code:1,
				userInfo,
				menuList:[],
				permissions:[]
			})
		}
		try{
			let role = await RoleModel.findById(roleId);
			if(!role){
				return res.json({
					code:1,
					userInfo,
					menuList:[],
					permissions:[]
				})
			}
			
			let {menuIds,resource} = role;
			let menuList=[];
			let permissionList=[];
			if(menuIds){
				menuIds = menuIds.split(',');
				let data = await MenuModel.findAll({
					where: {
					    id: {
					      [Op.in]: menuIds
					    }
					},
					raw:true
				})
				menuList = transformTozTreeFormat(data);
			}
			if(resource){
				resource = resource.split(',');
				permissionList = await PermissionModel.findAll({
					attributes:['resource','type'],
					where: {
					    id: {
					      [Op.in]: resource
					    }
					},
					raw:true
				})
				
			}
			
			res.json({
				code:1,
				menuList,
				userInfo,
				permissions:permissionList,
				msg:'用户信息获取成功'
			})

		}catch(err){
			return next(err);
		}
	}

	//创建用户
	async createUser(req,res,next){
		let {username,password,roleId} = req.body;
   		const md5 = crypto.createHash("md5");
		try{
			if(validator.isEmpty(username)||validator.isEmpty(password)){
				return res.json({
					code:0,
					msg:'用户名密码不得为空'
				})
			}
			let role = await RoleModel.findById(roleId)

			if(role&&role.super){
				return res.json({
					code:0,
					msg:'超级管理员用户已存在不可重复创建'
				})
			}
			let user = await UserModel.findOne({where:{username:username}});
			if(user){
				return res.json({
					code:0,
					msg:'该用户名已存在'
				})
			}
			let newPas = md5.update(password).digest("hex");
			await UserModel.create({
				username,
				password:newPas,
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
	
	//删除用户
	async removeUser(req,res,next){
		let ids = req.params['id'].split(',');
		let msg = '删除成功';

		if(ids.indexOf('1')!==-1&&ids.length>1){		//这里默认超级管理员用户id为1，超级管理员用户不可删除
			msg += ',超级管理员用户不可删除'
		}else if(ids.indexOf('1')!==-1&&ids.length==1){
			msg = '超级管理员用户不可删除';
			return res.json({
				code:0,
				msg
			})
		}
		let newIds = ids.filter(item=>{		
			return !(item==1);
		})
		
		try{
			await UserModel.destroy({
				where:{
					'id':{ 
						[Op.in]: newIds
					}
				}
			})
			res.json({
				code:1,
				msg
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
			let role = await RoleModel.findById(roleId)
			if(role&&role.super){
				return res.json({
					code:0,
					msg:'超级管理员用户已存在不可重复创建'
				})
			}
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
