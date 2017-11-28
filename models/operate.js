//功能操作表(编辑，删除等)
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_operate',
	    {
	        name: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: false        	// 是否允许为NULL
	          
	        },
	    }
	);
}




