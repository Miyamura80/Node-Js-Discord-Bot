const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'bless',
	description: 'Give money to a target player from thin air',
	args: true,
	dmonly: true,
	usage: '<@Person> <amount>   \n<@Person> is the person to give',
	category: ':mage: DM exclusive',
	async execute(message, args,dev,subjectMap,currency) {

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/g).slice(-1)[0];
		const searchName = commandArgs.split(/ +/g).slice(0,-1).join(' ');
		const transferTarget = await finduser.execute(message,searchName)
		if(!transferTarget) return message.channel.send(`User not found`)
		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);

		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully blessed ${transferAmount} ${currencyUnit} to **${transferTarget.tag}**.`);

	},
};