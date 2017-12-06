
export default function (sequelize, DataTypes) {
  	return sequelize.define(
	    // 默认表名（一般这里写单数），生成时会自动转换成复数形式
	    // 这个值还会作为访问模型相关的模型时的属性名，所以建议用小写形式
	    'user',
	    // 字段定义（主键、created_at、updated_at默认包含，不用特殊定义）
	    {
	        username: {
	            type: DataTypes.STRING,
	            allowNull: false
	        },
	        password:{
	        	type: DataTypes.STRING,
	            allowNull: false
	        },
	        roleId: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: true        	// 是否允许为NULL
	        },
	    }
	);
}





//User.sync({force: false}).then(() => {
//// 表已创建
//return User.create({
//  'emp_id': '3',
//  'nick': '小明',
//  'department': '技术部'
//});
//});


