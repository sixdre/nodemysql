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
		
	}

	//创建权限
	async createPermission(req,res,next){
		let obj = {
			name:req.body['name'],
			permission:req.body['permission'],
			type:req.body['type'].join(','),
			tag:req.body['tag'],
			createdAt:'2017-12-01 10:35:41',
			updatedAt:'2017-12-01 10:35:41'
		}
		try{
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
						attributes: ['id','path','name','pid','hidden','icon'],
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
			let role = await RoleModel.findOne({where:{id:roleId}});
			let menus = await MenuModel.findAll();
			menus = JSON.parse(JSON.stringify(menus));
			let paths =[];
			let ror=[];
			let data1=[];
			let ids=[];
			if(!role){
				res.json({
					code:0,
					msg:'没有找到该角色'
				})
				return ;
			}
			
			let {permission,resource} = role;
			
			if(permission){
				permission = permission.split(',')
				paths = await PermPathModel.findAll({
					where: {
					    id: {
					      [Op.in]: permission
					    }
					}
				})
				paths = JSON.parse(JSON.stringify(paths));
				
				paths.forEach(item=>{
					menus.map(s=>{
						if(s.id==item.menuId){
							s['permission'] = item.op.split(',')
						}
						return s;
					})
				})
				ids = paths.map(item=> Number(item.menuId))
				data1 = transformTozTreeFormat(menus)
			}
			if(resource){
				resource = resource.split(',')
			}
			
			res.json({
				ids,
				data1,
				resource
				
			})

		}catch(err){
			
		}
	}
	
	
	//根据分类获取权限
	async getMenuToPermission(req,res,next){
		let menus = await MenuModel.findAll();
			menus = transformTozTreeFormat(JSON.parse(JSON.stringify(menus)));
		let Pro = menus.map(item=>{
			return new Promise((resolve, reject) => {
				return  PermissionModel.findAll({
				  	where: {
				    	tag: item.id
				  	}
				}).then(re=>{
					item.permission = re;
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
	
	//保存角色的权限
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
		
		let Pro = menus.map(item=>{
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
		
		await RoleModel.update({permission:permission.join(','),resource:resource.join(',')},{where:{id: roleId}})
		
		
		res.json({
			code:1,
			msg:'创建成功'
		})
	
	}
	
	
	
	
	
}



export default new PermissionController();
