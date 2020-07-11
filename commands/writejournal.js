const Discord = require('discord.js');
const {Parties, PartyMatch} = require('../dbObjects');
const {currencyUnit} = require("../config.json")

const getusercharacter = require(`../utilityFunc/getusercharacter.js`);
const fs = require('fs');

const { Op } = require('sequelize');

module.exports = {
	name: 'writejournal',
	description: 'Provide prompt to write to the party journal.',
	aliases: ['write_journal'],
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
			return message.channel.send(`You do not have permission to write journals of parties which you aren't in!`);
		}

		const pathToFile = `./Campaign_Journals/${cpnNow}/${partyDB.party_name}.txt`

		try{
			if(!fs.existsSync(pathToFile)){
				message.channel.send("Created a new file for tracking party journal");
				await fs.writeFile(pathToFile, `Journal of ${partyDB.party_title}`,'utf8', function(err){
					if (err){ 
						throw err;
					}else{
						message.channel.send(`Successfully written tracking file to ${pathToFile}`);
					}
				});
			}
		}catch(err){
			console.error(err);
		}

		const filter = m => m.content.length > 0 && m.author.id==message.author.id 
		const collector = message.channel.createMessageCollector(filter, { time: 150000 , max: 1});

		const writer = chr ? chr.char_name : "DM"

		
		message.channel.send(`__Please write your journal entry for party__ \`${partyDB.party_name}\` ${message.author}:`);
		collector.on('collect', async m => {
			const date = new Date();
			await fs.appendFile(pathToFile, `\n__**${writer}@${date.getDate()}/${date.getMonth()}/${date.getFullYear()}:**__ ${m.content}`, (err) => {
				if (err){
					throw err;
				}else{
					message.channel.send('Written into journal successfully.');
				}
			});

			collector.stop();
		});


	},
};