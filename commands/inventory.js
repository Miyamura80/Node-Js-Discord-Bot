const Discord = require('discord.js');
const { Users} = require('../dbObjects');
const {currencyUnit} = require("../config.json")
module.exports = {
	name: 'inventory',
	description: 'Shows your current inventory',
	aliases: ['inv'],
	category: ':game_die: utility',
	async execute(message, args,dev,subjectMap,currency) {
		const target = message.author;


		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		const inventoryEmbed = new Discord.MessageEmbed()
					.setColor('#fc00fc')
					.setAuthor(`${target.username}`, `${target.displayAvatarURL({ format: "png", dynamic: true })}`)
					.setDescription(`${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`)
					.addField('In hand', `${currencyUnit} ${currency.getBalance(target.id)}`, false)
		

		
		return message.channel.send(inventoryEmbed);
	},
};