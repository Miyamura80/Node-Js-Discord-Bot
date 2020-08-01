const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'increasehp',
	dmonly: true,
	args: true,
	description: 'Increase Max HP of target Player',
	usage: '<name> <amount>  \n<name> is the name of the character in current campaign context.\n <amount> is the amount to increase by',
	aliases: ['increase_hp'],
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

		chr.max_hp += Number(damageAmount);
		chr.current_hp += Number(damageAmount);
		chr.save();

		return message.channel.send(`Successfully Increased HP of __**${chr.char_title}**__ to maximum of __**${chr.max_hp}**__`);


	},
};