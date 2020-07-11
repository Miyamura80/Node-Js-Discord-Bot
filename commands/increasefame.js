const Discord = require('discord.js');
const {Parties, PartyMatch} = require('../dbObjects');
const { Op } = require('sequelize');
const {prefix} = require("../config.json")

module.exports = {
	name: 'increasefame',
	dmonly: true,
	args: true,
	description: 'Increase a fame of a party',
	usage: '<name> <amount>  \n<name> is the name of the party \n <amount> is the fame to add',
	aliases: ['increase_fame'],
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const amount = commandArgs.split(/ +/g).slice(-1)[0];
		const partyName = commandArgs.split(/ +/g).slice(0,-1).join(' ');

		const prty = await Parties.findOne({ where: { party_name: { [Op.like]: partyName } } });
		if (!prty) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);

		if (!amount || isNaN(amount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);

		prty.fame += Number(amount);
		prty.save();

		return message.channel.send(`Successfully increased fame by __**${amount}**__ of __**${prty.party_title}**__`);


	},
};