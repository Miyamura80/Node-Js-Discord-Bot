module.exports = (sequelize, DataTypes) => {
	return sequelize.define('parties', {
		party_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		party_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		party_title: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		fame: {	//from 1-10
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		col_rel: {
			type: DataTypes.FLOAT,
			defaultValue: 1.0,
			allowNull: true,
		},
		sc_rel: {
			type: DataTypes.FLOAT,
			defaultValue: 1.0,
			allowNull: true,
		},
		woth_rel: {
			type: DataTypes.FLOAT,
			defaultValue: 1.0,
			allowNull: true,
		},
		cotm_rel: {
			type: DataTypes.FLOAT,
			defaultValue: 1.0,
			allowNull: true,
		}
		
	}, {
		timestamps: false,
	});
};