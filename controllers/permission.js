import {PermissionModel,MenuModel,RoleModel,PermPathModel} from '../models/'
import Sequelize from 'sequelize'
import transformTozTreeFormat from '../utility/tree'
const Op = Sequelize.Op;

class PermissionController {
	constructor() {
		
	}

	async getMenus(req,res,next){
		let menus = await MenuModel.findAll();
		let data = transformTozTreeFormat(JSON.parse(JSON.stringify(menus)))
		res.json({
			menus:menus,
			data
		})
	}

	//创建权限
	async createPermission(req,res,next){
		try{
			let obj = {
				name:req.body['name'],
				resource:req.body['resource'],
				type:req.body['type'].join(','),
				tag:req.body['tag'],
				createdAt:'2017-12-01 10:35:41',
				updatedAt:'2017-12-01 10:35:41'
			}
			await PermissionModel.create(obj);
			res.json({
				code:1,
				msg:'权限创建成功'
			})
		}catch(err){
			
		}
		
	}
	
	//删除权限
	removePermission(req,res,next){
		
	}
	
	
	//获取权限列表
	async getPermissionList(req,res,next){

		try{
			let permissions = await PermissionModel.findAll();
				permissions = JSON.parse(JSON.stringify(permissions));
			
			let Pro = permissions.map(item=>{
				return new Promise((resolve, reject) => {
					return  MenuModel.findOne({
						attributes: ['id','name'],
					  	where: {
					    	id: item.tag
					  	}
					}).then(re=>{
						item.tagName = re.name;
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
				msg:'权限列表获取成功'
			})
		}catch(err){
			
		}
	}
	
	//创建角色
	async createRole(req,res,next){
		let name = req.body.name;
		try{
			let role = await RoleModel.findOne({where: {name: name}});
			if(role){
				res.json({
					code:0,
					msg:'角色名称已存在'
				})
				return ;
			}
			let newrole={
				name,
				createdAt:'2017-12-01 10:35:41',
				updatedAt:'2017-12-01 10:35:41'
			}
			await  RoleModel.create(newrole);
			res.json({
				code:1,
				msg:'创建成功'
			})
		}catch(err){
			return next(err);
		}
	}


	//获取所有的角色
	async getRoles(req,res,next){
		let roles = await RoleModel.findAll();
		res.json({
			code:1,
			data:roles,
			msg:'获取成功'
		})
	}


	//根据角色来获取相应的权限
	
	async getPermissionByRoleId(req,res,next){
		let roleId = req.query['roleId'];
		//let roleId = req.userInfo.roleId;
		if(!roleId){
			res.json({
				code:-1,
				msg:'参数缺失'
			})
			return ;
		}
		try{
			let role = await RoleModel.findOne({where:{id:roleId}});
			if(!role){
				res.json({
					code:0,
					msg:'没有找到该角色'
				})
				return ;
			}
			let {permission,resource} = role;
			let menuList=[];
			
			if(!resource){
				resource = [];
			}else{
				resource = resource.split(',').map(item=>Number(item));
			}
			if(permission){
				permission = permission.split(',');
				let paths= await MenuModel.findAll({
					where: {
					    id: {
					      [Op.in]: permission
					    }
					}
				})
				menuList = transformTozTreeFormat(JSON.parse(JSON.stringify(paths)));
			}else{
				permission = [];
			}
			
			
			res.json({
				code:1,
				msg:'角色权限获取成功',
				menu:{
					checkIds:permission,
					list:menuList
				},
				resource
			})

		}catch(err){
			
		}
	}
	
	
	/*
	 * getMenuToPermission  
	 * desc(根据分类获取权限,分类从菜单表读取默认读取pid为0的数据) 
	 * */
	async getMenuToPermission(req,res,next){
		try{
			let menus = await MenuModel.findAll({
				attributes: ['id','name'],
				where:{
					pid:0
				}
			});		//一级菜单
			menus = JSON.parse(JSON.stringify(menus));
			
			let Pro = menus.map(item=>{
				return new Promise((resolve, reject) => {
					return  PermissionModel.findAll({
					  	where: {
					    	tag: item.id
					  	}
					}).then(re=>{
						item.resource = re;
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
				msg:'权限列表获取成功'
			})
		}catch(err){
			
		}
	}
	
	/*
	 * saveRolePermission  
	 * desc(保存角色的权限) 
	 * */
	async saveRolePermission(req,res,next){
		let roleId = req.body.roleId;
		let menus = req.body.menus;
		let resource = req.body.resource;
		let role = await RoleModel.findOne({where: {id: roleId}});
		if(!role){
			res.json({
				code:0,
				msg:'没有找到该角色'
			})
			return ;
		}

		await RoleModel.update({permission:menus.join(','),resource:resource.join(',')},{where:{id: roleId}})

		res.json({
			code:1,
			msg:'创建成功'
		})
	
	}
	
	
	
	
	
}



export default new PermissionController();
