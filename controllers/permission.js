import {MenuModel,MenuOpeModel,OperateModel,PermissionModel,PermModel} from '../models/'

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
	//查询所有
	async getMenus(req,res,next){
		try{
			let menus = await MenuModel.findAll();

   		var data = GetData(0, JSON.parse(JSON.stringify(menus)))
   			
   			
   			
			res.json({
				data
			})


		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}
	
	//创建权限
	async createPermission(req,res,next){
		
		
	}
	
	async getPermission(req,res,next){
		//读取权限表
		let permission = await PermModel.findAll()	

		let Pro = permission.map(item=>{
			return new Promise((resolve, reject) => {
				return  MenuModel.findOne({
					attributes: ['id','path','name','pid'],
				  	where: {
				    	id: item.menuId
				  	}
				}).then(re=>{
					
					let data = {
						id:re.id,
						path:re.path,
						name:re.name,
						pid:re.pid,
						permission:item.op.split(',')
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
