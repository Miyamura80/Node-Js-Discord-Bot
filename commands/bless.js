const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters} = require('../dbObjects');
const { Op } = require('sequelize');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'bless',
	description: 'Give money to a target player character from thin air',
	args: true,
	dmonly: true,
	usage: '<name> <amount>   \n<name> is the name of the character to give to',
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);


		const transferAmount = commandArgs.split(/ +/g).slice(-1)[0];
		const searchName = commandArgs.split(/ +/g).slice(0,-1).join(' ');


		const chr = await Characters.findOne({ where: { char_name: { [Op.like]: searchName } } });
		if (!chr) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);


		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);

		chr.balance += Number(transferAmount);
		chr.save();

		return message.channel.send(`Successfully blessed ${transferAmount} ${currencyUnit} to **${chr.char_title}**.`);

	},
};