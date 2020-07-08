const Discord = require('discord.js');
const {Parties, PartyMatch} = require('../dbObjects');
const {currencyUnit} = require("../config.json")
const getusercharacter = require(`../utilityFunc/getusercharacter.js`);

const { Op } = require('sequelize');

module.exports = {
	name: 'joinparty',
	description: 'Join an existing party of a certain name, and role if specified.',
	aliases: ['join_party'],
	usage: '<partyName> <role> \n<partyName> is the name of party to join \n<role> is the name of the role character takes',
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const roleName = args[1] ? args[1] : "Unspecified"

		const partyName = args[0];

		if(!args.length){
			const partyDBObjs = await Parties.findAll();
			return message.channel.send(partyDBObjs.map(party => `${party.party_title} : __**${party.party_name}**__`).join('\n'));
		}

		const chr = await getusercharacter.execute(message,campaignskeyv,message.author);
		if(!chr){
			return message.channel.send("You don't have a character assigned to you!");
		}

		const partyMatchDB = await PartyMatch.findOne({ where: { char_id: chr.char_id } })
		if(partyMatchDB){
			return message.channel.send(`You are already inside of a pre-existing party ${message.author	}`);
		}

		const partyDB = await Parties.findOne({ where: { party_name: { [Op.like]: args[0] } } });
		if(!partyDB) message.channel.send(`Party with name \`${args[0]}\` not found`);

		await chr.joinParty(partyDB, roleName);
		message.channel.send(`Successfully joined ${partyName}!`);


	},
};