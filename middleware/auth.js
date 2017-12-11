import {PermissionModel,MenuModel,RoleModel,PermModel,UserModel} from '../models/'

export default {
	async checkRole(req,res,next){
//		let uid = req.headers['uid'];
//		let user = await UserModel.findOne({where:{id:uid}});
//		let role = await RoleModel.findOne({where:{id:user.roleId}});
//		if(role.resource){
//			let permissionIds = role.resource.split(',');
//			let Pro = permissionIds.map(item=>{
//				return new Promise((resolve, reject) => {
//					return  PermissionModel.findOne({
//					  	where: {
//					    	id: item
//					  	}
//					}).then(re=>{
//						resolve(re.permission)
//					}).catch(err=>{
//						reject(err)
//					})
//				})
//			})
//			
//			let paths = await Promise.all(Pro);
//			console.log(req.route.path)
//			if(paths.indexOf(req.originalUrl)<0){
//				res.sendStatus(403);
//				return ;
//		//		res.status(403).json({ msg: '抱歉，您没有权限访问,请与系统管理员联系!' })
//			}
//			
//			next();
//			
//		}else{
//			//res.sendStatus(403);
//			next()
//		}
		
	
		next();
	}
}
