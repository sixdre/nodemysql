//权限表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'permission',
	    {
	        name: {
	            type: DataTypes.STRING, 
	            allowNull: false        	
	        },
	        resource:{		
	        	type: DataTypes.STRING, 
	            allowNull: false        	
	        },
	        type:{	
	        	type: DataTypes.STRING, 
	            allowNull: false        	
	        },
	        tag: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: true        	// 是否允许为NULL
	        },
	    }
	);
}






