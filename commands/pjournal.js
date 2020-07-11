const Discord = require('discord.js');
const {Parties, PartyMatch} = require('../dbObjects');
const {currencyUnit} = require("../config.json")

const getusercharacter = require(`../utilityFunc/getusercharacter.js`);
const fs = require('fs');

const { Op } = require('sequelize');

module.exports = {
	name: 'pjournal',
	description: 'Show your party journal.',
	aliases: ['party_journal','partyjournal'],
	usage: '<partyName> \n<partyName> is the name of party to write journal to. Only usable by DM.',
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const dmOrder = message.member.roles.cache.some(role => role.name === 'DM')

		let partyDB;

		const chr = await getusercharacter.execute(message,campaignskeyv,message.author);
		if(!chr && !dmOrder){
			return message.channel.send("You don't have a character assigned to you!");
		}

		if(!args.length){
			
			const partyMatchDB = await PartyMatch.findOne({ where: { char_id: chr.char_id } });
			if(!partyMatchDB){
				return message.channel.send(`Character __${chr.title}__ is not inside of a party ${message.author}!`);
			}
			partyDB = await Parties.findOne({ where: { party_id: partyMatchDB.party_id } });
			
		}else{
			partyDB = await Parties.findOne({ where: { party_name: { [Op.like]: args[0] } } });
			if(!partyDB) message.channel.send(`Party with name \`${args[0]}\` not found`);
		}

		
		if(!dmOrder && args.length){
			return message.channel.send(`You do not have permission to see journals of parties which you aren't in!`);
		}

		const pathToFile = `./Campaign_Journals/${cpnNow}/${partyDB.party_name}.txt`

		try{
			if(!fs.existsSync(pathToFile)){
				return message.channel.send(`The party has no journals ${message.author}!`);
			}
		}catch(err){
			console.error(err);
		}

		const entryNumPerPage = 10

		let readings;
		await fs.readFile(pathToFile, 'utf8', function(err, data) {
			if (err) throw err;
			readings = data.split(/\r?\n/).slice(1).reverse()
			const maxPage = parseInt((readings.length)/10)+1
			console.log(maxPage);
			sendJournal(0, maxPage, readings, 1) 
		});
		

		function sendJournal(pageNumber, maxPage, readings, pagesPrinted){
			
			const lastIndex = Math.min(entryNumPerPage,readings.length);

			const description = readings.slice(entryNumPerPage*pageNumber, entryNumPerPage*pageNumber+lastIndex).reverse().join(`\n`);

			const journalPage = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`__**Journal of ${partyDB.party_name}**__`)
				.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
				.setDescription(description)
				.setFooter(`Page ${pageNumber+1}/${maxPage}              Press ❌ to close the journal.`);
			
			const emojis = [`➡️`,`⬅️`,`❌`,]
			message.channel.send(journalPage).then(sentEmbed =>{
				if(pageNumber < maxPage && pageNumber > 0){
					sentEmbed.react(emojis[1]);
				}
				if(pageNumber>=0 && pageNumber < maxPage-1){
					sentEmbed.react(emojis[0]);
				}
				sentEmbed.react(emojis[2]);
				

				const filter = (reaction, user) => {
					return emojis.includes(reaction.emoji.name) && !(user.bot)
				};

				const collector = sentEmbed.createReactionCollector(filter, {time: 300000, max: 1})

				collector.on('collect', (reaction, user) => {
					i = 0;
					while(emojis[i]!=reaction.emoji.name){
						i += 1;
					}
					if(i==2){
						collector.stop();
						return message.channel.bulkDelete(pagesPrinted, true).catch(err => {
							console.error(err);
							message.channel.send('there was an error trying to prune messages in this channel!');
						});
					}
					const addAmount = (i==0) ? 1 : -1
					sendJournal(pageNumber+addAmount,maxPage,readings, pagesPrinted+1);

				});

				collector.on('end', (reaction,user) => {
					sentEmbed.reactions.removeAll()
				});
				
			});
		}


	},
};