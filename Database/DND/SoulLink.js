module.exports = (sequelize, DataTypes) => {
	return sequelize.define('soul_link', {
		user_id: DataTypes.STRING,
		char_id: DataTypes.INTEGER,
		campaign: {
			type: DataTypes.STRING,
			allowNull: false,
			'default': 'spiral_of_dietheld',
		},
	}, {
		timestamps: false,
	});
};