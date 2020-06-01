const {prefix} = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');

const textFiles = fs.readdirSync('./WikiTextFiles').filter(file => file.endsWith('.txt'));

//MAYBE remove this

const subjectMap = new Discord.Collection();

for (const file of textFiles){
	const subjName = file.substring(0, file.length-3)
	console.log("Loaded Wiki for: "+subjName);
	const subjContent = fs.readFile('./WikiTextFiles/'+file,"utf8",function(err,data){
		if(err) throw err;
		return data;
	});
	subjectMap.set(subjName, subjContent)
}



module.exports = {
	name: 'wiki',
	description: 'Provides information currently known about the characters/locations/items in the Spiral of Dietheld world.',
	aliases: ['wikia'],
	usage: '[keyword] \nWhere keyword is the subject in question to search',
	cooldown: 1,
	execute(message, args) {
		const data = []
		const {commands} = message.client;

		if(!args.length){
			
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Spiral of Dietheld Wiki')
				.setURL('https://discord.js.org/')
				.setDescription('Hi, I will provide narrative information about Spiral of Dietheld')
				.setThumbnail('https://i.imgur.com/wSTFkRM.png')
				.addFields(
					{ name: 'Regular field title', value: 'Some value here' },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Inline field title', value: 'Some value here', inline: true },
					{ name: 'Inline field title', value: 'Some value here', inline: true },
				)
				.addField('Inline field title', 'Some value here', true)
				.setImage('https://i.imgur.com/wSTFkRM.png')
				.setTimestamp()
				.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

			data.push(commands.map(command => `\`${command.name}\``).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			//split argument ensures that if over 2000 character limit, will split it appropriately
			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};