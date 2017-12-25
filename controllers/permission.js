import {PermissionModel,MenuModel,RoleModel} from '../models/'
import validator from 'validator'
import Sequelize from 'sequelize'
import transformTozTreeFormat from '../utility/tree'
const Op = Sequelize.Op;


class PermissionController {
	constructor() {
		
	}
	//获取前端页面菜单
	async getMenus(req,res,next){
		try{
			let menus = await MenuModel.findAll();
			let data = transformTozTreeFormat(JSON.parse(JSON.stringify(menus)))
			res.json({
				menus,
				data
			})
		}catch(err){
			return next(err);
		}
	}
	
	//创建菜单
	async createMenu(req,res,next){
		let {pid,path,name,icon,hidden} = req.body;
		if(validator.isEmpty(path)||validator.isEmpty(name)){
			return res.json({
				code:0,
				msg:'参数缺失'
			})
		}
		try{
			let menu = await MenuModel.findOne({ where: {[Op.or]: [{path: path}, {name: name}]}});
			if(menu){
				return res.json({
					code:0,
					msg:'已有改类型菜单'
				})
			}
			await MenuModel.create({pid,path,name,icon,hidden});
			res.json({
				code:1,
				msg:'菜单新增成功'
			})
		}catch(err){
			return next(err);
		}
	}
	
	//更新菜单
	async updateMenu(req,res,next){
		let {id,path,name,icon,hidden} = req.body;
		if(validator.isEmpty(path)||validator.isEmpty(name)){
			return res.json({
				code:0,
				msg:'参数缺失'
			})
		}
		try{
			let obj = {		
				path,
				name,
				icon,
				hidden
			}
			await MenuModel.update(obj,{where:{id:id}});
			res.json({
				code:1,
				msg:'菜单更新成功'
			})
		}catch(err){
			return next(err);
		}
	}

	//删除菜单
	async removeMenu(req,res,next){
		let id = req.params['id'];
		try{
			await MenuModel.destroy({
				where:{
					'id':id
				}
			})
			res.json({
				code:1,
				msg:'菜单删除成功'
			})
		}catch(err){
			return next(err);
		}
	}


	//创建权限
	async createPermission(req,res,next){
		try{
			let {id,name,resource,type,tag} = req.body;
			let obj = {		//创建
				name,
				resource,
				type,
				tag
			}
			if(id){				//更新
				await PermissionModel.update(obj,{where:{id:id}});
				res.json({
					code:1,
					msg:'权限更新成功'
				})
			}else{
				await PermissionModel.create(obj);
				res.json({
					code:1,
					msg:'权限创建成功'
				})
			}
		}catch(err){
			return next(err);
		}
		
	}
	
	//删除权限
	removePermission(req,res,next){
		
	}
	
	
	//获取权限列表
	async getPermissionList(req,res,next){
		let {page=1,limit=5,group=0} = req.query;
			page = Number(page),
			limit = Number(limit);
		try{
			if(group=='0'){			
				let results = await PermissionModel.findAndCountAll({limit: limit,offset: (page-1)*limit,order:[ ['id', 'DESC'],],raw:true});
				let permissions = results.rows;
				let count = results.count;
				
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
					count,
					msg:'权限列表获取成功'
				})
			}else{
				let menus = await MenuModel.findAll({
					attributes: ['id','name'],
					where:{
						pid:0
					},
					raw:true
				});		//一级菜单
	
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
			}
		}catch(err){
			return next(err);
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
				name
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
		try{
			let roles = await RoleModel.findAll();
			res.json({
				code:1,
				data:roles,
				msg:'获取成功'
			})
		}catch(err){
			return next(err);
		}
	}


	//根据角色来获取相应的权限
	async getPermissionByRoleId(req,res,next){
		let roleId = req.query['roleId'];
		if(!roleId){
			res.json({
				code:-1,
				msg:'参数缺失'
			})
			return ;
		}
		try{
			let role = await RoleModel.findById(roleId);
			if(!role){
				res.json({
					code:0,
					msg:'没有找到该角色'
				})
				return ;
			}
			let {menuIds,resource} = role;
			let menuList=[];
			
			if(!resource){
				resource = [];
			}else{
				resource = resource.split(',').map(item=>Number(item));
			}
			if(menuIds){
				menuIds = menuIds.split(',');
				let paths= await MenuModel.findAll({
					where: {
					    id: {
					      [Op.in]: menuIds
					    }
					},
					raw:true
				})
				menuList = transformTozTreeFormat(paths);
			}else{
				menuIds = [];
			}
			res.json({
				code:1,
				msg:'角色权限获取成功',
				menu:{
					checkIds:menuIds,
					list:menuList
				},
				resource
			})

		}catch(err){
			return next(err);
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
		let role = await RoleModel.findById(roleId);
		
		if(!role){
			res.json({
				code:0,
				msg:'没有找到该角色'
			})
			return ;
		}
		try{
			//先排下序
			menus.sort(function(a,b) { return a - b });
			resource.sort(function(a,b) { return a - b });
			
			await RoleModel.update({menuIds:menus.join(','),resource:resource.join(',')},{where:{id: roleId}})
			res.json({
				code:1,
				msg:'创建成功'
			})
		}catch(err){
			return next(err);
		}
	}
	
}



export default new PermissionController();
