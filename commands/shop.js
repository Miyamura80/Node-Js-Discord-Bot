const Discord = require('discord.js');
const {CurrencyShop, Users} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json");
const { Op } = require('sequelize');
module.exports = {
	name: 'shop',
	description: 'Display whats selling in the shop you are in',
	category: ':money_with_wings: economy',
	async execute(message, args,dev,subjectMap,currency) {


		const items = await CurrencyShop.findAll();
		return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });	

	},
};