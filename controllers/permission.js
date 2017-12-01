import {MenuModel,MenuOpeModel,RoleModel,OperateModel,PermissionModel,PermModel} from '../models/'

import Sequelize from 'sequelize'
const Op = Sequelize.Op;
//根据菜单主键id获取下级菜单
//id：菜单主键id
//arry：菜单数组信息
function GetParentArry(id, arry) {
    var newArry = new Array();
    for (var i in arry) {
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

	//创建权限
	async createPermission(req,res,next){
		
		
	}
	
	//创建角色
	createRole(req,res,next){
		let name = req.body.name;
		let role={
			name,
			createdAt:'2017-12-01 10:35:41',
			updatedAt:'2017-12-01 10:35:41'
		}
		RoleModel.create(role).then(result=>{
			res.json({
				code:1,
				msg:'创建成功'
			})
		},function(err){
			res.json({
				code:0,
				msg:'创建失败'
			})
		})
		
	}
	
	
	
	
	//根据角色的ID来获取当前角色对应的权限
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
					if(!permission){
						permission=[]
					}else{
						permission = permission.split(',')
					}
					let data = {
						id:re.id,
						path:re.path,
						name:re.name,
						pid:re.pid,
						permission:permission
					};
					resolve(data)
				}).catch(err=>{
					reject(err)
				})
			})
		})
		
		let data1 = await Promise.all(Pro);
		let pids = data1.map(item=> item.pid);
		let data = GetData(Math.min.apply( Math, pids), JSON.parse(JSON.stringify(data1)))
		return data;
	}
	
	
	
	async getPermission(req,res,next){
		let roleId = req.params['roleId'];;
		let data = await this.getPermissionByRoleId(roleId)
		res.json({
			data
		})
		
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
