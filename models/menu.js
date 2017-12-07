//菜单表
export default function (sequelize, DataTypes) {
  	return  sequelize.define(
	    'sys_menu',
	    {
	        pid: {
	            type: DataTypes.INTEGER(10), // 字段类型
	            allowNull: false,         	// 是否允许为NULL
//	            references: {
//			        model: 'sys_menu',
//			        key: 'id'
//			    },
	            //unique: true              // 字段是否UNIQUE(唯一)
	        },
	        path: {
	            type: DataTypes.STRING,
	            allowNull: false
	        },
	        name: {
	            type: DataTypes.STRING,
	            allowNull: false
	        },
	        icon:{
	        	type: DataTypes.STRING,
	            allowNull: true
	        },
	        hidden:{					//是否为超级管理员
	      		type: DataTypes.BOOLEAN,
	            allowNull: false, 
	            defaultValue:0		//默认值
	      	}
	    }
	);
}




