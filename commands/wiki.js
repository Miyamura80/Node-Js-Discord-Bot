const {prefix} = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');





module.exports = {
	name: 'wiki',
	description: 'Provides information currently known about the characters/locations/items in the Spiral of Dietheld world.',
	aliases: ['wikia'],
	category: ':game_die: utility',
	usage: '<keyword> \nWhere keyword is the subject in question to search',
	cooldown: 1,
	execute(message, args, dev, subjectMap) {
		const {commands} = message.client;
		const devUrl = dev.displayAvatarURL({ format: "png", dynamic: true })

		if(!args.length){
			
			const subjLists = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle('Spiral of Dietheld Wiki')
				.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
				.setDescription(`You can search information about the following by: \`${prefix}wiki [search term]\` `)
				.setFooter('Please help improving this wiki by messaging Eimi for any errors, typos, corrections', devUrl);

			const categories = ["Characters", "Groups", "Items", "Locations", "Concepts"];
			for(const categ of categories){
				var categList = "None";
				for(const m of subjectMap){

					if(m[1].type==categ){
						if(categList=="None"){
							categList = ""
						}
						categList += `\n ${m[1].name}`;
					}
				}
				subjLists.addField(`__**${categ}**__`,categList, true);
			}
			return message.channel.send(subjLists);

		}

		const name = args.join(' ').toLowerCase()
		// const name = args[0].toLowerCase().join;
		

		function getPage(name){
			const searchResult = subjectMap.get(name) || subjectMap.find(sbj => sbj.aliases && sbj.aliases.includes(name));

			if (!searchResult) {
				return message.channel.send('Search term not found.');
			}

			const inLineSubjWiki = false;
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
			}

			if(searchResult.lastSeen){
				subjWiki.addField(':eye:__**Last Seen:**__', searchResult.lastSeen,true)
			}

			if(searchResult.combat){
				subjWiki.addField(':crossed_swords:__**Combat:**__', searchResult.combat,inLineSubjWiki)
			}

			if(searchResult.origin){
				subjWiki.addField(':homes:__**Origin:**__', searchResult.origin,inLineSubjWiki)
			}

			if(searchResult.allegiance){
				subjWiki.addField(':handshake:__**Allegiance:**__', searchResult.allegiance,inLineSubjWiki)
			}

			if(searchResult.charRelationships){
				subjWiki.addField(':people_holding_hands:__**Character Relationships:**__', searchResult.charRelationships,inLineSubjWiki)
			}

			if(searchResult.trivia){
				subjWiki.addField(':capital_abcd:__**Trivia:**__', searchResult.trivia,inLineSubjWiki)
			}

			return subjWiki
		}


		const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']


		function sendRecursiveWikiPage(name){
			subjWiki = getPage(name)
			const searchResult = subjectMap.get(name) || subjectMap.find(sbj => sbj.aliases && sbj.aliases.includes(name));
			message.channel.send(subjWiki).then(sentEmbed =>{
				if(searchResult.hyperlinks){
					var i = 0;
					const n = searchResult.hyperlinks.length;
					const hyplks = searchResult.hyperlinks
					while(i<n && i < 10){
						sentEmbed.react(emojis[i]);
						i += 1;
					}

					const filter = (reaction, user) => {
						return emojis.includes(reaction.emoji.name) && !(user.bot)
					};

					const collector = sentEmbed.createReactionCollector(filter, {time: 300000, max: 1})

					collector.on('collect', (reaction, user) => {
						i = 0;
						while(emojis[i]!=reaction.emoji.name){
							i += 1;
						}
						sendRecursiveWikiPage(hyplks[i]);

					});

					collector.on('end', (reaction,user) => {
						sentEmbed.reactions.removeAll()
					});
				}
			});
		}
		sendRecursiveWikiPage(name);
	},
};