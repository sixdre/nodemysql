//菜单表操作关联表
export default function(sequelize, DataTypes) {
	return sequelize.define(
		'sys_menu_operate', {
			menuId: {
				type: DataTypes.INTEGER(10), // 字段类型
				allowNull: false, // 是否允许为NULL
				//	            references: {
				//			        model: 'sys_menu',
				//			        key: 'id'
				//			    },
				//unique: true              // 字段是否UNIQUE(唯一)
			},
			operateIds: {
				type: DataTypes.STRING, // 字段类型
				allowNull: false,
			},

		}
	);
}