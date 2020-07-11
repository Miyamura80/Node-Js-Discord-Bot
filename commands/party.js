const Discord = require('discord.js');
const {Parties, PartyMatch, Characters} = require('../dbObjects');
const getusercharacter = require(`../utilityFunc/getusercharacter.js`);
const {currencyUnit} = require("../config.json")
const { Op } = require('sequelize');

module.exports = {
	name: 'party',
	description: 'Display information of your current party.',
	aliases: ['party_info'],
	usage: '<partyName> \n<partyName> is the name of party to see. Only usable by DM.',
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		let partyDB;

		if(!args.length){
			const chr = await getusercharacter.execute(message,campaignskeyv,message.author);
			if(!chr){
				return message.channel.send("You don't have a character assigned to you!");
			}
			const partyMatchDB = await PartyMatch.findOne({ where: { char_id: chr.char_id } });
			if(!partyMatchDB){
				return message.channel.send(`Character __${chr.title}__ is not inside of a party ${message.author}!`);
			}
			partyDB = await Parties.findOne({ where: { party_id: partyMatchDB.party_id } });
			
		}else{
			partyDB = await Parties.findOne({ where: { party_name: { [Op.like]: args[0] } } });
			if(!partyDB) message.channel.send(`Party with name \`${args[0]}\` not found`);
		}
		
		const partyListings = await partyDB.getListings();

		const dmOrder = message.member.roles.cache.some(role => role.name === 'DM')
		if(args.length && !dmOrder){
			return message.channel.send(`You do not have permission to get information on parties which you aren't in!`);
		}

		const famebar = ":white_square_button:".repeat(partyDB.fame)+ ":white_large_square:".repeat(10-partyDB.fame);

		const partyEmbed = new Discord.MessageEmbed()
			.setColor('#fc00fc')
			.setDescription(`${partyDB.description}`)
			.setTitle(`__**${partyDB.party_title}**__`)
			.addField(`__**Fame: ${partyDB.fame}**__`, `${famebar}`, false);

		const healthper = 3
		for(const lst of partyListings){
			const partyMember = await Characters.findOne({ where: { char_id: lst.char_id } })
			let hpbar;
			const greenInitTryNum = parseInt(partyMember.current_hp/healthper)
			const redInitTryNum = parseInt((partyMember.max_hp-partyMember.current_hp)/healthper)
			if(greenInitTryNum+redInitTryNum > 27){
				const greenNum = parseInt(27*Number(partyMember.current_hp)/partyMember.max_hp)
				hpbar = ":green_square:".repeat(greenNum)+ ":red_square:".repeat(27-greenNum);
			}else{
				hpbar = ":green_square:".repeat(greenInitTryNum)+ ":red_square:".repeat(redInitTryNum);
			}
			const role = lst.role=="Unspecified" ? '' : `(${lst.role})`
			partyEmbed.addField(`__**Level ${partyMember.level}: ${partyMember.char_title}**__${role}: ${currencyUnit}${partyMember.balance}`, `${hpbar}`, false);
		}
		
			
		return message.channel.send(partyEmbed);




	},
};