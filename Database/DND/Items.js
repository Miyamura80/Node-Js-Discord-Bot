module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		item_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: true,
		},
		item_name: {
			type: DataTypes.STRING,
			allowNull: false,
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
			allowNull: false,
		},
		sc_value: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: false,
		},
		woth_value: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: false,
		},
		cotm_value: {
			type: DataTypes.FLOAT,
			defaultValue: 1,
			allowNull: false,
		}

	}, {
		timestamps: false,
	});
};