const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('./dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'assigncharacter',
	description: 'Assign a user to a given character',
	args: true,
	dmonly: true,
	usage: '<user> <name>   \n<user> is the discord user to be assigned the character \n<name> is the name of character to assign to specified user',
	aliases: ['assign_character'],
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const characterName = commandArgs.split(/ +/g).slice(-1)[0];
		const searchUserName = commandArgs.split(/ +/g).slice(0,-1).join(' ');

		//find user, if not found return
		const transferTarget = await finduser.execute(message,searchUserName);
		if(!transferTarget) return message.channel.send(`User not found`)
		
		//find character, if not found return
		const character = await Characters.findOne({ where: { name: { [Op.like]: characterName } } });
		if (!character) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);
		
		//find character pairing, to check for conflicts
		const soulLinkForChar = await SoulLink.findOne({ where: { char_id: { [Op.like]: characterName } } });
		if (character > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
		if (character <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

		currency.add(message.author.id, -characterName);
		currency.add(transferTarget.id, characterName);

		return message.channel.send(`Successfully transferred ${characterName} ${currencyUnit} to **${transferTarget.tag}**. Your current balance is ${currency.getBalance(message.author.id)} ${currencyUnit}`);


	},
};