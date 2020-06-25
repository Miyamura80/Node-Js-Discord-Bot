const Discord = require('discord.js');
const { Users} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'give',
	description: 'Give money to a target player',
	args: true,
	usage: '<@Person> <amount>   \n<@Person> is the person to give',
	aliases: ['transfer'],
	category: ':money_with_wings: economy',
	async execute(message, args,dev,subjectMap,currency) {

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/g).slice(-1)[0];
		const searchName = commandArgs.split(/ +/g).slice(0,-1).join(' ');
		const transferTarget = await finduser.execute(message,searchName)
		if(!transferTarget) return message.channel.send(`User not found`)
		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully transferred ${transferAmount} ${currencyUnit} to **${transferTarget.tag}**. Your current balance is ${currency.getBalance(message.author.id)} ${currencyUnit}`);

	},
};