import {UserModel,RoleModel,MenuModel} from '../models/'
import Sequelize from 'sequelize'
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
	let user =  await UserModel.findOne({
		attributes:['id','username','password','roleId'],where: {username: username}})
	if(!user){
		res.json({
			code:0,
			msg:'该用户不存在'
		})
	}else if(user.password!==password){
		res.json({
			code:0,
			msg:'密码错误'
		})
	}else{
		let role = await RoleModel.findById(user.roleId);
		user = JSON.parse(JSON.stringify(user));
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
}
	

export default login;
