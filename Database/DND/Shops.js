module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		shop_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			autoIncrement: true,
		},
		shop_name: {
			type: DataTypes.STRING,
			allowNull: false,
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
		}

	}, {
		timestamps: false,
	});
};