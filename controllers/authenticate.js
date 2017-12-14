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
		let role = await RoleModel.findOne({where:{id:user.roleId}});
		let data= await MenuModel.findAll({
			where: {
			    id: {
			      [Op.in]: role.permission.split(',')
			    }
			}
		})
		data = transformTozTreeFormat(JSON.parse(JSON.stringify(data)));
		var token = auth.setToken(JSON.parse(JSON.stringify(user)))
		res.json({
			code:1,
			msg:'登录成功',
			data:data,
			role:user.roleId,
			token:token
		})
	}
}
	

export default login;
