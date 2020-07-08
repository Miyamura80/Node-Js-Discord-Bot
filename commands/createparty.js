const Discord = require('discord.js');
const {Parties} = require('../dbObjects');
const {currencyUnit} = require("../config.json")
const finduser = require(`../utilityFunc/finduser.js`);
const getusercharacter = require(`../utilityFunc/getusercharacter.js`);

const { Op } = require('sequelize');

module.exports = {
	name: 'createparty',
	description: 'Creates a new party of a certain name. Afterwards, will provide options to choose descriptions and titles',
	aliases: ['create_party'],
	args: true,
	usage: '<partyName> \n<partyName> is the name of party to create (no spaces)',
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const partyName = args[0];

		const filter = m => m.content.includes(' ') && !m.author.bot 
		const collector = message.channel.createMessageCollector(filter, { time: 150000 , max: 2});

		var gotTitle = false;
		let partyTitle;
		let partyDescription;
		message.channel.send(`Please enter the title for the party \`${partyName}\``);
		collector.on('collect', async m => {
			if(!gotTitle){
				partyTitle = m.content;
				message.channel.send(`Please enter the description for the party \`${partyName}\``);
				gotTitle = true;
			}else{
				partyDescription = m.content;
				await Parties.upsert({party_name: partyName, party_title: partyTitle , description: partyDescription, fame: 1});
				message.channel.send(`Successfully created party \`${partyName}\` with __description:__ \n${partyDescription} \n__title:__ ${partyTitle}`);
				collector.stop();
			}
		});


	},
};