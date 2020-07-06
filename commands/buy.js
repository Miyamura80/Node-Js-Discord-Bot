const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters, ShopListing, Items, Shops, CharItems} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
const { Op } = require('sequelize');
module.exports = {
	name: 'buy',
	description: 'Buy a particular item at the shop',
	args: true,
	usage: '<shopname> <itemName> <quantity>   \n<shopname> is the name of shop \n<itemName> is the name of item you want to Buy \n<quantity> is the quantity you want to buy (default is 1)',
	aliases: ['purchase'],
	category: ':money_with_wings: economy',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const shopName = args[0];
		if(!args[1]){
			return message.channel.send(`You didn't specify an item name ${message.author}!`);
		}
		const itemName = args[1];

		const quant = args[2] ? args[2] : 1
		if(isNaN(quant)) return message.channel.send(`Sorry ${message.author}! You input an invalid amount`);
		if(Number(quant) <= 0) return message.channel.send(`Sorry ${message.author} Please input a positive quantity`);

		const shopDB = await Shops.findOne({ where: { shop_name: { [Op.like]: shopName } } });
		if (!shopDB) return message.channel.send(`Sorry ${message.author}, that's an invalid shop name.`);

		//find item, if not found return
		const itemDB = await Items.findOne({ where: { item_name: { [Op.like]: itemName } } });
		if (!itemDB) return message.channel.send(`Sorry ${message.author}, that's an invalid item name.`);

				
		const listing = await ShopListing.findOne({where: {item_id: itemDB.item_id, shop_id: shopDB.shop_id}});
		
		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
		}
		const chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });

		const cost = Number(quant)*listing.price
		if(cost > chr.balance) return message.channel.send(`Your character ${chr.char_title} does not have enough to buy the item ${message.author}! You need ${currencyUnit}${cost-chr.balance} more`);

		if(listing.infinite || listing.amount >= quant){
			await chr.addItem(itemDB, Number(quant));
			chr.balance -= cost;
			chr.save();
			await shopDB.addItem(itemDB, -Number(quant), listing.infinite);
			const charItemDB = await CharItems.findOne({where: {item_id: itemDB.item_id, char_id: chr.char_id}})
			return message.channel.send(`Successfully bought __**${itemName}**__ from __**${shopName}**__. \n__**Total number in your inventory:**__ ${charItemDB.amount} \n__**Remaining balance:**__ ${currencyUnit} ${chr.balance} `); 
		}
		
		return message.channel.send(`The shop ${shopName} doesn't have any more stock of ${itemName}`);

		

	},
};