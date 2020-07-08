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

const Parties = sequelize.import('Database/DND/Parties');


//Relations
const UserItems = sequelize.import('Database/models/UserItems');

const CharItems = sequelize.import('Database/DND/CharItems');
const ShopListing = sequelize.import('Database/DND/ShopListing');
const SoulLink = sequelize.import('Database/DND/SoulLink');
const PartyMatch = sequelize.import('Database/DND/PartyMatch');


UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });
CharItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item'})
ShopListing.belongsTo(Items, { foreignKey: 'item_id', as: 'item'})
SoulLink.belongsTo(Characters, { foreignKey: 'char_id', as: 'character'})
PartyMatch.belongsTo(Parties, { foreignKey: 'party_id', as: 'party'});

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
const ratingPrice = {
	'D': 1,
	'C': 5,
	'B': 20,
	'A': 50,
	'S': 100,
	'SS': 500,
	'SSS': 1000
}

Shops.prototype.addItem = async function(item, amt, infinite) {
	const shopItem = await ShopListing.findOne({
		where: { shop_id: this.shop_id, item_id: item.item_id },
	});

	if (shopItem) {
		if(shopItem.infinite){
			return
		}
		shopItem.amount += amt;
		return shopItem.save();
	}

	if(amt <= 0){
		return
	}

	return ShopListing.create({ shop_id: this.shop_id, item_id: item.item_id, amount: amt , infinite: infinite, price: ratingPrice[item.rating]});
};

Shops.prototype.setItem = async function(item, amount, infinite) {
	const shopItem = await ShopListing.findOne({
		where: { shop_id: this.shop_id, item_id: item.item_id },
	});

	if (shopItem) {
		shopItem.amount = amount;
		return shopItem.save();
	}

	return ShopListing.create({ shop_id: this.shop_id, item_id: item.item_id, amount: amount , infinite: infinite, price: ratingPrice[item.rating]});
};

Shops.prototype.getItems = function() {
	return ShopListing.findAll({
		where: { shop_id: this.shop_id }
	});
};


//Party-Character interaction
Parties.prototype.getListings = function() {
	return PartyMatch.findAll({
		where: { party_id: this.party_id }
	});
};

Characters.prototype.joinParty = async function(party, role) {
	const partyMatch = await PartyMatch.findOne({
		where: { char_id: this.char_id, party_id: party.party_id },
	});

	if(partyMatch){
		partyMatch.role = role;
		partyMatch.save()
	}
	if(role){
		return PartyMatch.create({char_id: this.char_id, party_id: party.party_id, role: role});
	}else{
		return PartyMatch.create({char_id: this.char_id, party_id: party.party_id});
	}
};


//Character-item interaction
Characters.prototype.addItem = async function(item, amt) {
	const charItem = await CharItems.findOne({
		where: { char_id: this.char_id, item_id: item.item_id },
	});

	if (charItem) {
		charItem.amount += amt;
		return charItem.save();
	}

	if(amt <= 0){
		return 
	}

	return await CharItems.create({ char_id: this.char_id, item_id: item.item_id, amount: amt });
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
	SoulLink, Characters, CharItems, Shops, ShopListing, Items, Parties, PartyMatch};