//角色表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'role',
	    {
	        name: {
	            type: DataTypes.STRING, 	// 字段类型
	            allowNull: false,         	// 是否允许为NULL
	        },
	      	permission:{
	      		type: DataTypes.STRING, 	// 字段类型
	            allowNull: true,         	// 是否允许为NULL
	      	},
	      	resource:{						//允许请求的后台Api
	      		type: DataTypes.STRING,
	            allowNull: true
	      	},
	      	super:{					//是否为超级管理员
	      		type: DataTypes.BOOLEAN,
	            allowNull: false, 
	            defaultValue:0		//默认值
	      	}
	    }
	);
}




