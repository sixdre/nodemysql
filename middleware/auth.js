import {PermissionModel,RoleModel} from '../models/'
import jwt from 'jsonwebtoken'
import config from '../config'
const secret = config.secret;

export default {
	checkToken(req,res,next){
	 	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	        
	    if(token) {//存在token，解析token
	      	jwt.verify(token, secret , function(err,decoded) {
		        if(err) {
		            // 解析失败直接返回失败警告
		          	return res.status(401).json({success:false,msg:'token验证失败',err})
		        }else {
		            //解析成功加入请求信息，继续调用后面方法
		          	req.userInfo = decoded;
		          	next()
		        }
	      	})
	    }else {
	      	return res.status(401).json({success:false,msg:"token验证失败"})
	    }
	},

	setToken(data){
	    let token = jwt.sign(data, secret, {
	      	expiresIn: '24h' 	//24h
	    })
	    return token;
	},

	async checkRole(req,res,next){
		let role = await RoleModel.findById(req.userInfo.roleId);
		let flag = false;
		let method = req.method;
		if(role.resource){
			let permissionIds = role.resource.split(',');
			let Pro = permissionIds.map(item=>{
				return new Promise((resolve, reject) => {
					return  PermissionModel.findOne({
						attributes: ['id','name','resource','type'],
					  	where: {
					    	id: item
					  	},
					  	raw:true
					}).then(re=>{
						resolve(re)
					}).catch(err=>{
						reject(err)
					})
				})
			})
			
			let paths = await Promise.all(Pro);
			let myUrl = req.baseUrl+req.path;
			paths.forEach(item=>{
				if(item.type.toUpperCase() == method){
					if(item.resource == myUrl||item.resource==(req.baseUrl+req.route.path)){
						flag = true ;
						return ;
					}
				}
			})	

			if(!flag){
				res.sendStatus(403);
				//res.status(403).json({ msg: '抱歉，您没有权限访问,请与系统管理员联系!' })
				return ;
			}
			next();
		}else{
			res.sendStatus(403);
			//next()
		}
	}
}
