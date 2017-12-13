import {PermissionModel,MenuModel,RoleModel,PermPathModel} from '../models/'

import Sequelize from 'sequelize'
const Op = Sequelize.Op;

//生成tree数据
function transformTozTreeFormat (sNodes) {
	let setting = {idKey:'id',parentKey:'pid',childKey:'child'};
    var i, l,
        key = setting.idKey,
        parentKey = setting.parentKey,
        childKey = setting.childKey;
    if (!key || key == "" || !sNodes) return [];

    if (Array.isArray(sNodes)) {
        var r = [];
        var tmpMap = {};
        for (i = 0, l = sNodes.length; i < l; i++) {
            tmpMap[sNodes[i][key]] = sNodes[i];
            if(!sNodes[i].permission) sNodes[i].permission=[]	//my add
        }
        for (i = 0, l = sNodes.length; i < l; i++) {
            if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
                if (!tmpMap[sNodes[i][parentKey]][childKey])
                    tmpMap[sNodes[i][parentKey]][childKey] = [];
                tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
            } else {
                r.push(sNodes[i]);
            }
        }
        return r;
    } else {
        return [sNodes];
    }
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
				return PermPathModel.create(newper).then(function(results){
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
		
		let permissions = await PermPathModel.findAll({
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
		
		let ids = permissions.map(item=> Number(item.menuId))
		
		let data = transformTozTreeFormat(JSON.parse(JSON.stringify(menus)))
	
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
		
		let permissions = await PermPathModel.findAll({
			where: {
			    id: {
			      [Op.in]: role.permission.split(',')
			    }
			}
		})
		let Pro = permissions.map(item=>{
			return new Promise((resolve, reject) => {
				return  MenuModel.findOne({
					attributes: ['id','path','name','pid','hidden','icon'],
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
					re = JSON.parse(JSON.stringify(re))
					if(re){
						re.permission=permission
					}else{
						re = {};
					}
					resolve(re)
				}).catch(err=>{
					reject(err)
				})
			})
		})
		
		let data1 = await Promise.all(Pro);
		let ids = data1.map(item=> Number(item.id));
		let data = transformTozTreeFormat(JSON.parse(JSON.stringify(data1)))
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
		let data = transformTozTreeFormat(JSON.parse(JSON.stringify(menus)))
		res.json({
			menus:menus,
			data
		})
	}
	
	
}



export default new PermissionController();
