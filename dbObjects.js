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
SoulLink.belongsTo(Characters, { foreignKey: 'char_id', as: 'character'})

//SoulLink Interaction
Users.prototype.assignCharacter = async function(character,campaignName) {
	const soulLink = await SoulLink.findOne({
		where: { user_id: this.user_id, char_id: character.char_id },
	});

	if (soulLink) {
		return true;
	}

	return SoulLink.create({ user_id: this.user_id, char_id: character.char_id, campaign: campaignName });
};

Users.prototype.getCharacter = function(campaignName) {
	return SoulLink.findOne({
		where: {user_id: this.user_id,  campaign: campaignName },
		include: ['character'],
	});
};


//Shop-item interaction
Shops.prototype.addItem = async function(item) {
	const shopItem = await UserItems.findOne({
		where: { shop_id: this.shop_id, item_id: item.id },
	});

	if (shopItem) {
		shopItem.amount += 1;
		return shopItem.save();
	}

	return CharItems.create({ shop_id: this.shop_id, item_id: item.id, amount: 1 });
};

Shops.prototype.setItem = async function(item, amount) {
	const shopItem = await UserItems.findOne({
		where: { shop_id: this.shop_id, item_id: item.id },
	});

	if (shopItem) {
		shopItem.amount = amount;
		return shopItem.save();
	}

	return CharItems.create({ shop_id: this.shop_id, item_id: item.id, amount: amount });
};

Shops.prototype.getItems = function() {
	return CharItems.findAll({
		where: { char_id: this.char_id },
		include: ['item'],
	});
};




//Character-item interaction
Characters.prototype.addItem = async function(item) {
	const charItem = await UserItems.findOne({
		where: { char_id: this.char_id, item_id: item.id },
	});

	if (charItem) {
		charItem.amount += 1;
		return charItem.save();
	}

	return CharItems.create({ char_id: this.char_id, item_id: item.id, amount: 1 });
};

Characters.prototype.getItems = function() {
	return CharItems.findAll({
		where: { char_id: this.char_id },
		include: ['item'],
	});
};


//User-server functions
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

module.exports = { Users, CurrencyShop, UserItems,
	SoulLink, Characters, CharItems, Shops, ShopListing, Items};