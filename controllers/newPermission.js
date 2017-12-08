import {PermissionModel,MenuModel,RoleModel,PermModel} from '../models/'

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

	
}



export default new PermissionController();
