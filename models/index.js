import Sequelize from 'sequelize'
import db from '../config/db'
import data from '../config/data'
const sequelize = new Sequelize(db.database, db.username, db.password, {
	host: db.host,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 30000
	}
});







//导出数据模型
export const UserModel  = sequelize.import('./user.js');
export const MenuModel  = sequelize.import('./menu.js');
export const PermPathModel  = sequelize.import('./permPath.js');
export const RoleModel  = sequelize.import('./role.js');
export const PermissionModel  = sequelize.import('./permission.js');
//UserModel.hasOne(UserModel);
//UserModel.belongsTo(UserModel);




// 同步模型到数据库中
function initSqlData(){
	sequelize.sync().then(function(){
		MenuModel.findAll().then((results)=>{
			if(!results.length){
				data.menus.map(item=>{
					MenuModel.create(item);
				})
			}
		})
		PermPathModel.findAll().then((results)=>{
			if(!results.length){
				data.menus.map(item=>{
					let newPerm = {
						name:'超级管理员的权限',
						menuId:item.id,
						op:item.permission.join(','),
						createdAt:'2017-12-01 10:35:41',
						updatedAt:'2017-12-01 10:35:41'
					}
					PermPathModel.create(newPerm);
				})
			}
		})
		
		
		RoleModel.findAll().then((results)=>{
			if(!results.length){
				let obj = {
					name:'超级管理员',
					permission:'1,2,3,4,5,6,7,8,9',
					super:1,
					createdAt:'2017-12-01 10:35:41',
					updatedAt:'2017-12-01 10:35:41'
				}
				RoleModel.create(obj);
			}
		})
		
		
		UserModel.findAll().then((results)=>{
			if(!results.length){
				let obj = {
					username:'admin',
					password:'123',
					roleId:1,
					createdAt:'2017-12-01 10:35:41',
					updatedAt:'2017-12-01 10:35:41'
				}
				UserModel.create(obj);
			}
		})
		
	}).catch(function(error) {
	  
	});
}


initSqlData()





