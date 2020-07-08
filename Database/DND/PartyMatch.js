module.exports = (sequelize, DataTypes) => {
	return sequelize.define('party_match', {
		char_id: DataTypes.INTEGER,
		party_id: DataTypes.INTEGER,
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			'default': "Unspecified",
		}
	}, {
		timestamps: false,
	});
};