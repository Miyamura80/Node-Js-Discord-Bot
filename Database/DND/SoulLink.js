module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_item', {
		user_id: DataTypes.STRING,
		char_id: DataTypes.STRING,
		campaign: {
			type: DataTypes.STRING,
			allowNull: false,
			'default': 'spiral_of_dietheld',
		},
	}, {
		timestamps: false,
	});
};