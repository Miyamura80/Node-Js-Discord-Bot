const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
const {currencyUnit} = require("../config.json")
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');
module.exports = {
	name: 'inventory',
	description: 'Shows your current inventory within the current campaign context',
	aliases: ['inv'],
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		let chr;
		if(!args[0]){
			const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
			if(!soulLinkForUser){
				return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
			}
			chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
		}else{
			chr = await Characters.findOne({ where: { char_name: { [Op.like]: args[0] } } });
			if (!chr) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);
		}

		
		const inline = true;

		const items = await chr.getItems()

		if (!items.length) return message.channel.send(`__**${chr.char_title}**__ has nothing!`);
		const inventoryEmbed = new Discord.MessageEmbed()
					.setColor('#fc00fc')
					.setAuthor(`${chr.char_title}`)
					.setDescription(`${items.map(i => `[\`${i.item.item_name}\`] ${i.amount}`).join('\n ')}`)
					.addField('In hand', `${currencyUnit} ${chr.balance}`, false)
		
		return message.channel.send(inventoryEmbed);
	},
};