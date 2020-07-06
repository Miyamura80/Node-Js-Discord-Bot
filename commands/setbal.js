const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters} = require('../dbObjects');
const { Op } = require('sequelize');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'setbal',
	description: 'Set balance of target player character to a balance',
	args: true,
	dmonly: true,
	usage: '<name> <amount>   \n<name> is the name of the character to give to',
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);


		const setAmount = commandArgs.split(/ +/g).slice(-1)[0];
		const searchName = commandArgs.split(/ +/g).slice(0,-1).join(' ');


		const chr = await Characters.findOne({ where: { char_name: { [Op.like]: searchName } } });
		if (!chr) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);


		if (!setAmount || isNaN(setAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);

		chr.balance = Number(setAmount);
		chr.save();

		return message.channel.send(`Successfully set **${chr.char_title}**'s balance to ${setAmount} ${currencyUnit} to.`);

	},
};