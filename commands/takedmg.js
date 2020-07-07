const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const getusercharacter = require(`../utilityFunc/getusercharacter.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'takedmg',
	description: 'Take damage specified',
	usage: '<amount>  \n <amount> is the amount to take. Set to 1 if not specified',
	aliases: ['selfdmg',"takedamage"],
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {

		const chr = await getusercharacter.execute(message,campaignskeyv,message.author);
		if(!chr){
			return message.channel.send("You don't have a character assigned to you!");
		}

		const amount = args[0] ? Number(args[0]) : 1; 
		
		chr.current_hp -= amount 
		chr.save();
		
		return message.channel.send(`Successfully deducted __${amount}HP__. Your health is now: __${chr.current_hp}HP__`);


	},
};