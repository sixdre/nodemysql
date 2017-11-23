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

export default sequelize;