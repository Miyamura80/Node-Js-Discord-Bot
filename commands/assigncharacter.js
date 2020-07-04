const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
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
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const characterName = commandArgs.split(/ +/g).slice(-1)[0];
		const searchUserName = commandArgs.split(/ +/g).slice(0,-1).join(' ');

		//find user, if not found return
		const transferTarget = await finduser.execute(message,searchUserName);
		if(!transferTarget) return message.channel.send(`User not found`)

		//find character, if not found return
		const character = await Characters.findOne({ where: { char_name: { [Op.like]: characterName } } });
		if (!character) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);


		
		//find character pairing, to check for conflicts
		const soulLinkForChar = await SoulLink.findOne({ where: { char_id: character.char_id, campaign: cpnNow } });
		if(!soulLinkForChar){
			const userFind = await Users.findOne({where: {user_id: transferTarget.id}});
			if(!userFind){
				Users.create({ user_id: transferTarget.id, balance: 0});
			}
			const user = await Users.findOne({where: {user_id: transferTarget.id}});
			await user.assignCharacter(character, cpnNow);
			return message.channel.send(`Assigned __**${character.char_name}**__ to __**${transferTarget.username}**__ in campaign __**${cpnNow}**__`);
		}
		
		return message.channel.send(`You already have a character __**${character.char_name}**__ to a discord user with ID __**${soulLinkForChar.user_id}**__ in campaign:  __**${cpnNow}**__`);


	},
};