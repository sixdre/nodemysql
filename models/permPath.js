//权限表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'permPath',
	    {
	        name: {
	            type: DataTypes.STRING, 
	            allowNull: true        	
	        },
	        menuId:{		//菜单操作关联表
	        		type: DataTypes.STRING, 
	            allowNull: false        	
	        },
	        op:{		//菜单操作关联表
	        		type: DataTypes.STRING, 
	            allowNull: true        	
	        }
	    }
	);
}






