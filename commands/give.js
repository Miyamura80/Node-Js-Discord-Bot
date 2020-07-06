const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
const { Op } = require('sequelize');
module.exports = {
	name: 'give',
	description: 'Give money to a target player character',
	args: true,
	usage: '<name> <amount>   \n<name> is the name of character playerr to give money to',
	aliases: ['transfer'],
	category: ':money_with_wings: economy',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);


		const transferAmount = commandArgs.split(/ +/g).slice(-1)[0];
		const searchName = commandArgs.split(/ +/g).slice(0,-1).join(' ');


		const chr = await Characters.findOne({ where: { char_name: { [Op.like]: searchName } } });
		if (!chr) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);

		
		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
		}
		//We assume we can find the character
		const userChar = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
		const currentAmount = userChar.balance

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, your character only has ${currencyUnit}${currentAmount}.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

		userChar.balance -= Number(transferAmount);
		userChar.save();

		chr.balance += Number(transferAmount);
		chr.save();

		return message.channel.send(`Successfully transferred ${transferAmount} ${currencyUnit} to **${chr.char_title}**. Your current balance is ${userChar.balance} ${currencyUnit}`);

	},
};