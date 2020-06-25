const Discord = require('discord.js');
const {currencyUnit,prefix} = require("../config.json")
const finduser = require(`../utilityFunc/finduser.js`);

module.exports = { 
	name: 'balance',
	description: 'Presents your current balance',
	aliases: ['bal','b'],
	usage: '<@Person>      \n(Person specified to oneself by default)',
	cooldown: 0.2,
	category: ':money_with_wings: economy',
	async execute(message, args,dev,subjectMap,currency) {
		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		if(commandArgs){
			const target = await finduser.execute(message,commandArgs);
			if(!target){
				return message.channel.send(`User not found`);
			}
			const balanceEmbed = new Discord.MessageEmbed()
						.setColor('#fc00fc')
						.setAuthor(`${target.username}`, `${target.displayAvatarURL({ format: "png", dynamic: true })}`)
						.addField('In hand', `${currencyUnit} ${currency.getBalance(target.id)}`, false)
			return message.channel.send(balanceEmbed);
		}else{
			const target = message.author
			const balanceEmbed = new Discord.MessageEmbed()
						.setColor('#fc00fc')
						.setAuthor(`${target.username}`, `${target.displayAvatarURL({ format: "png", dynamic: true })}`)
						.addField('In hand', `${currencyUnit} ${currency.getBalance(target.id)}`, false)
			return message.channel.send(balanceEmbed);
		}	
	},
};