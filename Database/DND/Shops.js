module.exports = (sequelize, DataTypes) => {
	return sequelize.define('shops', {
		shop_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		shop_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		shop_title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		allegiance: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		owner: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		campaign: {
			type: DataTypes.STRING,
			allowNull: false,
		}

	}, {
		timestamps: false,
	});
};