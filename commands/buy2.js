const Discord = require('discord.js');
const {CurrencyShop, Users} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json");
const { Op } = require('sequelize');
module.exports = {
	name: 'buy2',
	description: 'Buy a particular item at the shop',
	args: true,
	usage: '<name>   \n<name> is the name of item you want to Buy',
	aliases: ['purchase'],
	category: ':money_with_wings: economy',
	async execute(message, args,dev,subjectMap,currency) {

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });
		if (!item) return message.channel.send(`That item doesn't exist.`);
		if (item.cost > currency.getBalance(message.author.id)) {
			return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
		}

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.cost);
		await user.addItem(item);

		message.channel.send(`You've bought: ${item.name}.`);



	},
};