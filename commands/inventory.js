const Discord = require('discord.js');
const { Users} = require('../dbObjects');
const {currencyUnit} = require("../config.json")
module.exports = {
	name: 'inventory',
	description: 'Shows your current inventory within the current campaign context',
	aliases: ['inv'],
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)
		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
		}
		const chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
		const inline = true;

		const items = await chr.getItems()
		const target = message.author;

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		const inventoryEmbed = new Discord.MessageEmbed()
					.setColor('#fc00fc')
					.setAuthor(`${chr.char_title}`, `${target.displayAvatarURL({ format: "png", dynamic: true })}`)
					.setDescription(`${items.map(i => `${i.amount} ${i.item.item_name}`).join(', ')}`)
					.addField('In hand', `${currencyUnit} ${chr.balance}`, false)
		
		return message.channel.send(inventoryEmbed);
	},
};