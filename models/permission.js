//权限表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_permission',
	    {
	        name: {
	            type: DataTypes.STRING, 
	            allowNull: true        	
	        },
	        mopId:{		//菜单操作关联表
	        	type: DataTypes.STRING, 
	            allowNull: false        	
	        }
	    }
	);
}





