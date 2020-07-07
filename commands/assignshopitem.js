const Discord = require('discord.js');
const { Users, SoulLink, Characters,Shops, ShopListing, Items} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'assignshopitem',
	description: 'Assign an item to a given shop',
	args: true,
	dmonly: true,
	usage: '<shopName> <itemName> <amount>  \n<shopName> is the name of shop to be assigned the item \n<itemName> is the name of item to assign to specified shop \n <amount> is the stock of the shop. Set to infinite unless this is specified',
	aliases: ['assign_character','xasi'],
	category: ':mage: DM exclusive',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {

		const cpnNow = await campaignskeyv.get(message.guild.id)

		const itemName = args[1];
		const shopName = args[0];

		const infinite = args[2] ? false : true;
		const amount = args[2] ? args[2] : 80; 

		//find shop, if not found return
		const shopDB = await Shops.findOne({ where: { shop_name: { [Op.like]: shopName } } });
		if(!shopDB) return message.channel.send(`Sorry ${message.author}, that's an invalid shop name.`);

		//find item, if not found return
		const itemDB = await Items.findOne({ where: { item_name: { [Op.like]: itemName } } });
		if (!itemDB) return message.channel.send(`Sorry ${message.author}, that's an invalid item name.`);

		
		await shopDB.setItem(itemDB, Number(amount), infinite);

		const printStr = infinite ? '' : `with ${amount}`
		
		return message.channel.send(`Successfully set __**${itemName}**__ to __**${shopName}**__ with infinite set to \`${infinite}\` ${printStr}`);


	},
};