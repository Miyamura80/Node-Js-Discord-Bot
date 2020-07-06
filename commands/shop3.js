const Discord = require('discord.js');
const {CurrencyShop, Users} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json");
const { Op } = require('sequelize');
module.exports = {
	name: 'shop3',
	description: 'Display whats selling in the shop you are in',
	usage: '<name>   \n<name> is the name of the shop you want to view',
	category: ':money_with_wings: economy',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)
		

		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
		}
		const chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
		const inline = true;

		const items = await chr.getItems()
		const target = message.author;


		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });	

	},
};