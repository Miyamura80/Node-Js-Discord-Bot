const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const getusercharacter = require(`../utilityFunc/getusercharacter.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'pay',
	description: 'Pay a given amount of money',
	usage: '<amount>  \n <amount> is the amount to pay. Set to 1 if not specified',
	aliases: ["paymoney"],
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {

		const chr = await getusercharacter.execute(message,campaignskeyv,message.author);
		if(!chr){
			return message.channel.send("You don't have a character assigned to you!");
		}

		const amount = args[0] ? Number(args[0]) : 1; 

		if(amount <= 0){
			return message.channel.send("Please enter a non-negative number");
		}
		if(isNaN(amount)){
			return message.channel.send("Please enter a valid number");
		}
		
		chr.balance -= amount 
		chr.save();
		
		return message.channel.send(`Successfully paid __${currencyUnit}${amount}__. Your balance is now: __${currencyUnit}${chr.balance}__`);


	},
};