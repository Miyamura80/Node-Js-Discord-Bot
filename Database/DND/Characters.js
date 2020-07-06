module.exports = (sequelize, DataTypes) => {
	return sequelize.define('characters', {
		char_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		char_name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		char_title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		char_class: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		char_background: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		char_race: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		char_alignment: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		max_hp: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		current_hp: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		str: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		str_mod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		dex: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		dex_mod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		const: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		const_mod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		intel: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		intel_mod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		wis: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		wis_mod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		charis: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		charis_mod: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		armor_class: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		initiative: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		prof_bonus: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		speed: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		party: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		religion: {
			type: DataTypes.STRING,
			allowNull: true,
		}


	}, {
		timestamps: false,
	});
};