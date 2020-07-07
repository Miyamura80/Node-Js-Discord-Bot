const Discord = require('discord.js');
const { Users, SoulLink, Characters, Items} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'opgiveitem',
	description: 'Give a character some amount of items from thin air',
	args: true,
	dmonly: true,
	usage: '<charName> <itemName> <amount>  \n<charName> is the name of character to give item to \n<itemName> is the name of item to give to specified character \n <amount> is the amount to give. Set to 1 unless this is specified',
	aliases: ['xgi'],
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {

		const cpnNow = await campaignskeyv.get(message.guild.id)

		const itemName = args[1];
		const charName = args[0];

		const amount = args[2] ? args[2] : 1; 

		//find char, if not found return
		const charDB = await Characters.findOne({ where: { char_name: { [Op.like]: charName } } });
		if(!charDB) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);

		//find item, if not found return
		const itemDB = await Items.findOne({ where: { item_name: { [Op.like]: itemName } } });
		if (!itemDB) return message.channel.send(`Sorry ${message.author}, that's an invalid item name.`);

		
		await charDB.addItem(itemDB, Number(amount));
		
		return message.channel.send(`Successfully given ${amount} __**${itemName}**__ to __**${charName}**__ `);


	},
};