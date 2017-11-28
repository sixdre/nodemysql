//权限表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_permission,
	    {
	        name: {
	            type: DataTypes.STRING, 
	            allowNull: false        	
	          
	        }
	    }
	);
}




