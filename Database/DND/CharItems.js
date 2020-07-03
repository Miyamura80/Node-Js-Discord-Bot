module.exports = (sequelize, DataTypes) => {
	return sequelize.define('char_item', {
		char_id: DataTypes.INTEGER,
		item_id: DataTypes.INTEGER,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
};