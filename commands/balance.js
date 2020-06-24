const Discord = require('discord.js');
const {currencyUnit} = require("../config.json")
module.exports = { 
	name: 'balance',
	description: 'Presents your current balance',
	aliases: ['bal','b'],
	cooldown: 0.2,
	category: ':money_with_wings: economy',
	execute(message, args,dev,subjectMap,currency) { 
		const user = await finduser.execute(message)
		const target = message.mentions.users.first() || message.author;
		const balanceEmbed = new Discord.MessageEmbed()
					.setColor('#fc00fc')
					.setAuthor(`${target.username}`, `${target.displayAvatarURL({ format: "png", dynamic: true })}`)
					.addField('In hand', `${currencyUnit} ${currency.getBalance(target.id)}`, false)
		return message.channel.send(balanceEmbed);
	},
};