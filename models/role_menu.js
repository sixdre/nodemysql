export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_role_menu',
	    {
	        roleId: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: false        	// 是否允许为NULL
	          
	        },
	        menusId: {
	            type: DataTypes.STRING,
	            allowNull: false
	           
	        },

	    }
	);
}




