import db from '../config/db'
class UsersController {
	//查询所有
	async getUsers(req,res,next){
		try{
			let results = await db.query('SELECT * FROM user');
			res.render('index', { userList: results });
		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}
	
	//根据id查询
	async getUserById(req,res,next){
		let id = req.params['id'];
		let query = `SELECT * FROM user where id=${id} limit 1`;
		try{
			let results = await db.query(query);
			res.send({
				code:200,
				msg:'查询成功',
				data:results[0]
			})
		}catch(err){
			console.log('查询出错'+err);
			return next(err);
		}
	}
	
	//添加
	async createUser(req,res,next){
		let {name,password} = req.body;
		let query = `insert into user(name,password) values(${name},${password})`;
		try{
			let results = await db.query(query);
			res.send('添加成功')
		}catch(err){
			console.log('添加出错'+err);
			return next(err);
		}
	}
	
	//更新
	async updateUser(req,res,next){
		let id = req.params['id'];
		let query = `update user set name="狗蛋" where id=${id}`;
		try{
			let results = await db.query(query);
			res.send('更新成功')
		}catch(err){
			console.log('更新出错'+err);
			return next(err);
		}
		
	}
	
	//删除
	async deleteUser(req,res,next){
		let id = req.params['id'];
		let query = `delete from user where id=${id}`;
		try{
			let results = await db.query(query);
			res.send('删除成功')
		}catch(err){
			console.log('删除出错'+err);
			return next(err);
		}
	}
	
}



export default new UsersController();
