const Discord = require('discord.js');
const { Users, SoulLink, Characters, Items} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const getusercharacter = require(`../utilityFunc/getusercharacter.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'use',
	description: 'Use an item in character inventory',
	args: true,
	usage: '<itemName> <amount>  \n<itemName> is the name of item to use \n <amount> is the amount to use. Set to 1 if not specified',
	aliases: ['useitem'],
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {

		const chr = await getusercharacter.execute(message,campaignskeyv,message.author);
		if(!chr){
			return message.channel.send("You don't have a character assigned to you!");
		}
		const itemName = args[0];

		const amount = args[1] ? args[1] : 1; 

		//find item, if not found return
		const itemDB = await Items.findOne({ where: { item_name: { [Op.like]: itemName } } });
		if (!itemDB) return message.channel.send(`Sorry ${message.author}, that's an invalid item name.`);
		
		await chr.addItem(itemDB, -Number(amount));
		
		return message.channel.send(`Successfully used ${amount} ${itemName}`);


	},
};