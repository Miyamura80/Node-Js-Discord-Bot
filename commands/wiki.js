const {prefix} = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');





module.exports = {
	name: 'wiki',
	description: 'Provides information currently known about the characters/locations/items in the Spiral of Dietheld world.',
	aliases: ['wikia'],
	usage: '[keyword] \nWhere keyword is the subject in question to search',
	cooldown: 1,
	execute(message, args, dev, subjectMap) {
		const {commands} = message.client;

		if(!args.length){
			
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#fc00fc')
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
		const searchResult = subjectMap.get(name)


		if (!searchResult) {
			return message.channel.send('Search term not found.');
		}


		const devUrl = dev.displayAvatarURL({ format: "png", dynamic: true })
		const subjWiki = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(searchResult.title)
				.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
				.setDescription(searchResult.description)
				.addField('__**Type:**__', searchResult.type, true)
				.setFooter('Please help improving this wiki by messaging Eimi for any errors, typos, corrections', devUrl);

		if(searchResult.image){
			const imgUrl = "https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/WikiArts/"+searchResult.image
			subjWiki.setThumbnail(imgUrl);
		}else{
			const imgUrl = "https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/WikiArts/unknown.png"
			subjWiki.setThumbnail(imgUrl);
			console.log("No img found")
		}

		if(searchResult.lastSeen){
			subjWiki.addField(':eye:__**Last Seen:**__', searchResult.lastSeen)
			console.log("3");
		}

		if(searchResult.combat){
			subjWiki.addField(':crossed_swords:__**Combat:**__', searchResult.combat)
		}

		if(searchResult.origin){
			subjWiki.addField(':homes:__**Origin:**__', searchResult.origin)
		}

		if(searchResult.allegiance){
			subjWiki.addField(':handshake:__**Allegiance:**__', searchResult.allegiance)
		}

		if(searchResult.charRelationships){
			subjWiki.addField(':people_holding_hands:__**Character Relationships:**__', searchResult.charRelationships)
		}

		if(searchResult.trivia){
			subjWiki.addField(':capital_abcd:__**Trivia:**__', searchResult.trivia)
		}




		message.channel.send(subjWiki);
	},
};