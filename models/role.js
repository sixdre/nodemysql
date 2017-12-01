//角色表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_role',
	    {
	        name: {
	            type: DataTypes.STRING, // 字段类型
	            allowNull: false,         	// 是否允许为NULL
	        },
	      	permission:{
	      		type: DataTypes.STRING, // 字段类型
	            allowNull: true,         	// 是否允许为NULL
	      	}
	    }
	);
}




