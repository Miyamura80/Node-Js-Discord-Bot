module.exports = (sequelize, DataTypes) => {
	return sequelize.define('items', {
		item_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		item_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		item_title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		num_limit: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		rating: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		trivia: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		col_value: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: true,
		},
		sc_value: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: true,
		},
		woth_value: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: true,
		},
		cotm_value: {
			type: DataTypes.FLOAT,
			defaultValue: 1,
			allowNull: true,
		}
		
	}, {
		timestamps: false,
	});
};