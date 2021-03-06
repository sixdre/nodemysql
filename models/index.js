import Sequelize from 'sequelize'
import db from '../config/db'
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
export const RoleModel  = sequelize.import('./role.js');
export const PermissionModel  = sequelize.import('./permission.js');

//PermissionModel.belongsTo(MenuModel);



//sequelize.sync({force: true});

//{force: false}