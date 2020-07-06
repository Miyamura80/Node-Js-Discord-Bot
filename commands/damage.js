const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'damage',
	dmonly: true,
	args: true,
	description: 'Deal damage to a target player character',
	usage: '<name> <amount>  \n<name> is the name of the character in current campaign context.\n <amount> is the damage to deal, can be negative to heal',
	aliases: ['dealdamage'],
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const damageAmount = commandArgs.split(/ +/g).slice(-1)[0];
		const searchName = commandArgs.split(/ +/g).slice(0,-1).join(' ');

		const chr = await Characters.findOne({ where: { char_name: { [Op.like]: searchName } } });
		if (!chr) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);

		if (!damageAmount || isNaN(damageAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
		if (damageAmount > chr.current_hp) return message.channel.send(`Character ${chr.char_title} is now dead`);


		chr.current_hp -= Number(damageAmount);
		chr.save();

		return message.channel.send(`Successfully dealt __**${damageAmount}**__ to __**${chr.char_title}**__`);


	},
};