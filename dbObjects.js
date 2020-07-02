const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('Database/models/Users');
const CurrencyShop = sequelize.import('Database/models/CurrencyShop');

const Characters = sequelize.import('Database/DND/Characters');
const Items = sequelize.import('Database/DND/Items');
const Shops = sequelize.import('Database/DND/Shops');


//Relations
const UserItems = sequelize.import('Database/models/UserItems');

const CharItems = sequelize.import('Database/DND/CharItems');
const ShopListing = sequelize.import('Database/DND/ShopListing');
const SoulLink = sequelize.import('Database/DND/SoulLink');


UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });
CharItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item'})
ShopListing.belongsTo(Items, { foreignKey: 'item_id', as: 'item'})
SoulLink.belongsTo(Characters, { foreignKey: 'char_id', as: 'item'})

Users.prototype.addItem = async function(item) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

module.exports = { Users, CurrencyShop, UserItems };