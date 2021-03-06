import {UserModel,RoleModel,MenuModel} from '../models/'
import Sequelize from 'sequelize'
import crypto from "crypto"
import auth from '../middleware/auth'
import transformTozTreeFormat from '../utility/tree'
const Op = Sequelize.Op;

async function login(req,res,next){
	let {username,password} = req.body;
	if(!username||!password){
		res.json({
			code:-1,
			msg:'参数错误'
		})
	}
	try{
		let user =  await UserModel.findOne({
			attributes:['id','username','password','roleId'],
			where: {
				username: username
			},
			raw:true
		})
		const md5 = crypto.createHash("md5");
		if(!user){
			res.json({
				code:0,
				msg:'该用户不存在'
			})
			
		}else if(user.password!==md5.update(password).digest("hex")){
			res.json({
				code:0,
				msg:'密码错误'
			})
		}else{
			let role = await RoleModel.findById(user.roleId);
			if(!role){
				user.roleName = '';
			}
			user.roleName = role.name;
			var token = auth.setToken(user)
			res.json({
				code:1,
				msg:'登录成功',
				role:{
					name:role.name,
					id:user.roleId
				},
				token:token
			})
		}
	}catch(err){
		return next(err);
	}
	
}
	

export default login;
