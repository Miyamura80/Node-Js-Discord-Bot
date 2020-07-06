const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters, ShopListing, Items} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
const { Op } = require('sequelize');
module.exports = {
	name: 'buy2',
	description: 'Buy a particular item at the shop',
	args: true,
	usage: '<shopname> <name>   \n<shopname> is the name of shop \n<name> is the name of item you want to Buy',
	aliases: ['purchase'],
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
		const itemName = commandArgs.split(/ +/g).slice(-1)[0];
		const shopName = commandArgs.split(/ +/g).slice(0,-1).join(' ');

		const sShop = await Shops.findOne({ where: { shop_name: { [Op.like]: shopName } } });
		if (!sShop) return message.channel.send(`Sorry ${message.author}, that's an invalid shop name.`);

		
		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
		}
		//We assume we can find the character
		const userChar = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
		const currentAmount = userChar.balance

		const listings = await ShopListing.findAll

		

	},
};