const Discord = require('discord.js');
const { Users, SoulLink, Characters} = require('../dbObjects');
const finduser = require(`../utilityFunc/finduser.js`);
const { Op } = require('sequelize');

const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'stats',
	description: 'Show character stats associated with character in current campaign context. Shows character associated with caller by default',
	usage: '<name>   \n<name> is the name of the character in current campaign context',
	aliases: ['character_stats','char_stats'],
	category: ':game_die: utility',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		if(!args.length){
			const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
			if(!soulLinkForUser){
				return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
			}
			const chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
			const inline = true;
			const greenNum = parseInt(27*Number(chr.current_hp)/chr.max_hp)
			const hpbar = ":green_square:".repeat(greenNum)+ ":red_square:".repeat(27-greenNum);
			const playerStat = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`${chr.char_title}`)
				.addField('__**Class**__',`${chr.char_class}`,inline)
				.addField('__**Background**__',`${chr.char_background}`,inline)
				.addField('__**Race**__',`${chr.char_race}`,inline)
				.addField('__**Alignment**__',`${chr.char_alignment}`,inline)
				.addField('__**Level**__',`${chr.level}`,!inline)
				.addField(`__**HP: ${chr.current_hp}/${chr.max_hp}**__`,hpbar,!inline)
				.addField('__**STRENGTH**__',`${chr.str} (+${chr.str_mod})`,inline)
				.addField('__**DEXTERITY**__',`${chr.dex} (+${chr.dex_mod})`,inline)
				.addField('__**CONSTITUTION**__',`${chr.const} (+${chr.const_mod})`,inline)
				.addField('__**INTELLIGENCE**__',`${chr.intel} (+${chr.intel_mod})`,inline)
				.addField('__**WISDOM**__',`${chr.wis} (+${chr.wis_mod})`,inline)
				.addField('__**CHARISMA**__',`${chr.charis} (+${chr.charis_mod})`,inline)
				.addField('__**Armor Class**__',`${chr.armor_class}`,inline)
				.addField('__**Initiative**__',`${chr.initiative}`,inline)
				.addField('__**Proficiency Bonus**__',`${chr.prof_bonus}`,inline)
				.addField('__**Speed**__',`${chr.speed}`,inline)
				.addField('__**Balance**__',`${currencyUnit}${chr.balance}`,inline)
			return message.channel.send(playerStat);
		}

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const chr = await Characters.findOne({ where: { char_name: { [Op.like]: commandArgs } } });
		if (!chr) return message.channel.send(`Sorry ${message.author}, that's an invalid character name.`);

		const greenNum = parseInt(27*Number(chr.current_hp)/chr.max_hp)
		const hpbar = ":green_square:".repeat(greenNum)+ ":red_square:".repeat(27-greenNum);

		const inline = true;
		const playerStat = new Discord.MessageEmbed()
			.setColor('#fc00fc')
			.setTitle(`${chr.char_title}`)
			.addField('__**Class**__',`${chr.char_class}`,inline)
			.addField('__**Background**__',`${chr.char_background}`,inline)
			.addField('__**Race**__',`${chr.char_race}`,inline)
			.addField('__**Alignment**__',`${chr.char_alignment}`,inline)
			.addField('__**Level**__',`${chr.level}`,!inline)
			.addField(`__**HP: ${chr.current_hp}/${chr.max_hp}**__`,hpbar,!inline)
			.addField('__**STRENGTH**__',`${chr.str} (+${chr.str_mod})`,inline)
			.addField('__**DEXTERITY**__',`${chr.dex} (+${chr.dex_mod})`,inline)
			.addField('__**CONSTITUTION**__',`${chr.const} (+${chr.const_mod})`,inline)
			.addField('__**INTELLIGENCE**__',`${chr.intel} (+${chr.intel_mod})`,inline)
			.addField('__**WISDOM**__',`${chr.wis} (+${chr.wis_mod})`,inline)
			.addField('__**CHARISMA**__',`${chr.charis} (+${chr.charis_mod})`,inline)
			.addField('__**Armor Class**__',`${chr.armor_class}`,inline)
			.addField('__**Initiative**__',`${chr.initiative}`,inline)
			.addField('__**Proficiency Bonus**__',`${chr.prof_bonus}`,inline)
			.addField('__**Speed**__',`${chr.speed}`,inline)
			.addField('__**Balance**__',`${currencyUnit}${chr.balance}`,inline)
		return message.channel.send(playerStat);


	},
};