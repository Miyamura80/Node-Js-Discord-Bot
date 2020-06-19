const {prefix} = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 1,
	execute(message, args, dev) {
		const data = []
		const {commands} = message.client;		


		if(!args.length){
			const helpList = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle('**Command List**')
				.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
				.setDescription(`You can search information about the following by: \`${prefix}wiki [search term]\` `)
				.setFooter(`For more detailed usage info, do ${prefix}help <commandName>`);
			//Just put them in a list
			const cmdlistStr = commands.map(command => `\`${command.name}\``).join(', ');
			helpList.addField(`__**Commands**__`,cmdlistStr, true);

			return message.channel.send(helpList)
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		const helpSpecificList = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`**Name: ${prefix}${command.name}**`);

		const inlineYes = false;
		if(command.aliases){
			helpSpecificList.addField(`__**Aliases**__`,`${command.aliases.join(', ')}`, inlineYes);
		}
		if (command.description) helpSpecificList.addField(`__**Description**__`,`${command.description}`, inlineYes);
		if (command.usage) helpSpecificList.addField(`__**Usage**__`,`\`${prefix}${command.name} ${command.usage}\``, inlineYes);
		helpSpecificList.addField(`__**Cooldown**__`,`${command.cooldown || 3} second(s)`, inlineYes);

		message.channel.send(helpSpecificList);
	},
};