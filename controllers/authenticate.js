import {UserModel,RoleModel,PermPathModel,MenuModel} from '../models/'
import permissionCtrl from '../controllers/permission'
import Sequelize from 'sequelize'
import auth from '../middleware/auth'
const Op = Sequelize.Op;

async function login(req,res,next){
	let {username,password} = req.body;
	if(!username||!password){
		res.json({
			code:-1,
			msg:'参数错误'
		})
	}
	let user =  await UserModel.findOne({where: {username: username}})
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
		let data = await permissionCtrl.getPermissionByRoleId(user.roleId);
		var token = auth.setToken(JSON.parse(JSON.stringify(user)))
		res.json({
			code:1,
			msg:'登录成功',
			data:data.data,
			role:user.roleId,
			token:token
		})
	}
}
	

export default login;
