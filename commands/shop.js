const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters, Shops, ShopListing, Items} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
const { Op } = require('sequelize');
module.exports = {
	name: 'shop',
	description: 'Display whats selling in the shop you are in',
	usage: '<name>   \n<name> is the name of the shop you want to view',
	category: ':money_with_wings: economy',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		if(!args.length){
			const shopDBObjs = await Shops.findAll();
			console.log(shopDBObjs)
			return message.channel.send(shopDBObjs.map(shop => `${shop.shop_title} : __**${shop.shop_name}**__`).join('\n'));
		}

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);


		const sShop = await Shops.findOne({ where: { shop_name: { [Op.like]: commandArgs } } });
		if (!sShop) return message.channel.send(`Sorry ${message.author}, that's an invalid shop name.`);

		
		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
		}
		//We assume we can find the character
		const userChar = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
		const currentAmount = userChar.balance

		const listings = ShopListing.findAll({
			where: { shop_id: sShop.shop_id }
		});

		const itemssoldAndPrice = listings.map(async lst => {
			const item = await Items.findOne({ where: { item_id: lst.item_id } });
			return `${item.item_name} : ${currencyUnit} ${lst.price}`
		}).join('\n');

		return message.channel.send(itemssoldAndPrice);

	},
};