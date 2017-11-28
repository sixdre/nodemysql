//权限菜单表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_perm_menu',
	    {
	        permId: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: false        	// 是否允许为NULL
	          
	        },
	        menuId: {
	            type: DataTypes.STRING,
	            allowNull: false
	           
	        },

	    }
	);
}




