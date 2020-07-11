const {prefix, defaultCampaign} = require('../config.json');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'wiki',
	description: 'Provides information currently known about the characters/locations/items in the Spiral of Dietheld world.',
	aliases: ['wikia'],
	category: ':game_die: utility',
	usage: '<keyword> \nWhere keyword is the subject in question to search',
	cooldown: 1,
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const {commands} = message.client;
		const devUrl = dev.displayAvatarURL({ format: "png", dynamic: true })
		const currentCampaign = await campaignskeyv.get(message.guild.id)

		const subjectMap = campaignWikiMap.get(currentCampaign);

		let cmpName;
        const cpnNow = await campaignskeyv.get(message.guild.id)
        if(cpnNow){
            cmpName = cpnNow
        }else{
            cmpName = defaultCampaign
        }
        //short for current campaign content
        const ccc = require('../campaigns/'+cmpName+'.json')

		if(!args.length){
			
			const subjLists = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`${ccc.title} Wiki`)
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
				console.log("jjjjjj");
				return null;
			}

			const defaultAttr = {
				"image": ':eye:__**Last Seen:**__',
				"combat": ':crossed_swords:__**Combat:**__',
				"rating": '__**Rating:**__',
				"origin": ':homes:__**Origin:**__',
				"allegiance": ':handshake:__**Allegiance:**__',
				"charRelationships": ':people_holding_hands:__**Character Relationships:**__',
				"trivia": ':capital_abcd:__**Trivia:**__'
			};

			var giantString = searchResult.description
			for(const attr in defaultAttr){
				if(searchResult[attr]){
					giantString += searchResult[attr]
				}
			}


			const references = giantString.match(/\[(.*?)\]/g);
			var index = 0;
			const descMod = searchResult.description.replace(/\[(.*?)\]/g, function (x){
				index += 1;
				return `${x}: [${index}]`
			});

			var resultStrs = {}
			for(const crit in defaultAttr){
				if(searchResult[crit]){
					resultStrs[crit] = searchResult[crit].replace(/\[(.*?)\]/g, function (x){
						index += 1;
						return `${x}: [${index}]`
					});

				}
			}



			const inLineSubjWiki = false;
			const subjWiki = new Discord.MessageEmbed()
					.setColor('#fc00fc')
					.setTitle(searchResult.title)
					.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
					.setDescription(descMod)
					.addField('__**Type:**__', searchResult.type, true)
					.setFooter('Please help improving this wiki by messaging Eimi for any errors, typos, corrections', devUrl);

			if(searchResult.image){
				const imgUrl = "https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/WikiArts/"+searchResult.image
				subjWiki.setThumbnail(imgUrl);
			}

			for(const crit in defaultAttr){
				if(searchResult[crit]){
					subjWiki.addField(defaultAttr[crit], resultStrs[crit], inLineSubjWiki)
				}
			}

			return [subjWiki, references]
		}


		const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']


		function sendRecursiveWikiPage(name){
			let subjWiki;
			let references;
			[subjWiki, references] = getPage(name)
			if(!subjWiki){
				return message.channel.send("Search term not found.");
			}
			const searchResult = subjectMap.get(name) || subjectMap.find(sbj => sbj.aliases && sbj.aliases.includes(name));
			message.channel.send(subjWiki).then(sentEmbed =>{
				if(references){
					var i = 0;
					const n = references.length;
					const hyplks = references.map(refName => refName.slice(1, -1));
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