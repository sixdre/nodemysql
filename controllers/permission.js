import {MenuModel,RoleModel,PermModel} from '../models/'

import Sequelize from 'sequelize'
const Op = Sequelize.Op;
//根据菜单主键id获取下级菜单
//id：菜单主键id
//arry：菜单数组信息
function GetParentArry(id, arry) {
    var newArry = new Array();
    for (var i in arry) {
    	var permission = arry[i].permission;
    	if(!permission||!permission.length){
    		arry[i].permission = [];
    	}
        if (arry[i].pid == id){
        	newArry.push(arry[i]);
        }
    }
    return newArry;
}


function GetData(id, arry) {
    var childArry = GetParentArry(id, arry);		//一级菜单
    if (childArry.length > 0) {
        for (var i in childArry) {
        	var c = GetData(childArry[i].id, arry);
        	if(c.length){
        		childArry[i].child = c;
        	}
        }
    }
     
    return childArry;
}






class PermissionController {
	constructor() {
		this.getPermission = this.getPermission.bind(this)
	}

	//给角色分配权限
	async createPermissionByRoleId(req,res,next){
		let pers = req.body.data;
		let roleId = req.body.roleId;
		if(!roleId){
			res.json({
				code:-1,
				msg:'参数缺失'
			})
			return ;
		}
		let role = await RoleModel.findOne({where: {id: roleId}});
		if(!role){
			res.json({
				code:0,
				msg:'没有找到该角色'
			})
			return ;
		}

		let Pro = pers.map(item=>{
			let newper={
				name:'测试权限',
				menuId:item.id,
				op:item.permission.join(','),
				createdAt:'2017-12-01 10:35:41',
				updatedAt:'2017-12-01 10:35:41'
			}
			return new Promise((resolve, reject) => {
				return PermModel.create(newper).then(function(results){
					resolve(results.id);
				},reject)
			})
		})
//		
		let permission = await Promise.all(Pro);
		
		await RoleModel.update({permission:permission.join(',')},{where:{id: roleId}})
		
		res.json({
			code:1,
			msg:'创建成功'
		})
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
			res.json({
				code:0,
				msg:'创建失败'
			})
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
	

	//根据角色的ID来获取当前角色对应的权限
	async getPermissionByRoleIdForUpdate(req,res,next){
		let roleId = req.body['roleId'];
		let role =  await RoleModel.findOne({where: {id: roleId}});
		if(!role.permission){
			return [];
		}
		
		let permissions = await PermModel.findAll({
			where: {
			    id: {
			      [Op.in]: role.permission.split(',')
			    }
			}
		})
		permissions = JSON.parse(JSON.stringify(permissions))
		
		let menus = await MenuModel.findAll();
			menus = JSON.parse(JSON.stringify(menus))
		
		permissions.forEach(item=>{
			menus.map(s=>{
				if(s.id==item.menuId){
					s['permission'] = item.op.split(',')
				}
				return s;
			})
		})
		
		let ids = permissions.map(item=> item.menuId)
		let pids = menus.map(item=> item.pid);
		let data = GetData(Math.min.apply( Math, pids), JSON.parse(JSON.stringify(menus)))
		
		res.json({
			ids,
			data
		})

	}
	
	
	async getPermissionByRoleId(roleId){
		let role =  await RoleModel.findOne({where: {id: roleId}});
		if(!role.permission){
			return [];
		}
		
		let permissions = await PermModel.findAll({
			where: {
			    id: {
			      [Op.in]: role.permission.split(',')
			    }
			}
		})
		let Pro = permissions.map(item=>{
			return new Promise((resolve, reject) => {
				return  MenuModel.findOne({
					attributes: ['id','path','name','pid'],
				  	where: {
				    	id: item.menuId
				  	}
				}).then(re=>{
					let permission = item.op;
					let data = {}
					if(!permission){
						permission=[]
					}else{
						permission = permission.split(',')
					}
					re = JSON.parse(JSON.stringify(re))
					if(re){
						data.id=re.id,
						data.path=re.path,
						data.name=re.name,
						data.pid=re.pid,
						data.permission=permission
					}
					resolve(data)
				}).catch(err=>{
					reject(err)
				})
			})
		})
		
		let data1 = await Promise.all(Pro);
		let ids = data1.map(item=> item.id);
		
		
		let pids = data1.filter(item => {
			return !(item.pid===undefined)		//判断当前的是否为空对象
		}).map(item=> item.pid);
		
		let minId = Math.min.apply( Math, pids);
		let data = GetData(Math.min.apply( Math, pids), JSON.parse(JSON.stringify(data1)))
		
		return {
			ids,
			data
		};
	}
	
	
	
	
	async getPermission(req,res,next){
		let roleId = req.body['roleId'];
		let data = await this.getPermissionByRoleId(roleId)
		res.json(data)
		
	}
	async getMenus(req,res,next){
		let menus = await MenuModel.findAll();
		let pids = menus.map(item=> item.pid);
		let data = GetData(Math.min.apply( Math, pids), JSON.parse(JSON.stringify(menus)))
		res.json({
			data
		})
	}
	//读取权限
	/*async getPermission(req,res,next){
		
		//读取权限表
		let permission = await PermissionModel.findOne({
			attributes: ['id', 'mopId']
		})
		let permissionIds = permission.mopId.split(',').map(item=> Number(item));
		
		//读取菜单操作关联表
		let menus = await MenuOpeModel.findAll({
			attributes: ['menuId', 'operateIds'],
			where: {
			    id: {
			      [Op.in]: permissionIds
			    }
			}
		})
		
		let Pro = menus.map(item=>{
			 return new Promise((resolve, reject) => {
                return OperateModel.findAll({
                	attributes: ['name'],
					 where: {
					    id: {
					      [Op.in]: item.operateIds.split(',').map(item=> Number(item))
					    }
					  }
				}).then((results)=>{
					return  MenuModel.findOne({
						attributes: ['id','path','name','pid'],
					  	where: {
					    	id: item.menuId
					  	}
					}).then(re=>{
						let permission = results.map(item=> item.name);
						let data = {
							id:re.id,
							path:re.path,
							name:re.name,
							pid:re.pid,
							permission:permission
						};
						resolve(data)
					})
				},reject)
           });
		})
		
		
		let data1 = await Promise.all(Pro)
		let pids = data1.map(item=> item.pid);
		let data = GetData(Math.min.apply( Math, pids), JSON.parse(JSON.stringify(data1)))
		
		res.json({
			data
		})
		
	}*/
	
}



export default new PermissionController();
