//角色管联权限表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_role_perm',
	    {
	        permId: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: false,         	// 是否允许为NULL
	        },
	      
	    }
	);
}




