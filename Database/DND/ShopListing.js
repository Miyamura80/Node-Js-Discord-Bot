module.exports = (sequelize, DataTypes) => {
	return sequelize.define('shop_listing', {
		shop_id: DataTypes.INTEGER,
		item_id: DataTypes.INTEGER,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
		infinite: {
			type: DataTypes.BOOLEAN,
			'default': false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
};