const Discord = require('discord.js');
const {CurrencyShop, Users} = require('../dbObjects');
const fs = require('fs');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'setcampaign',
	description: 'Sets the current campaign to a specified campaign',
	args: true,
	dmonly: true,
	usage: '<name>   \n<name> is the name of campaign you want to play',
	aliases: ['set_campaign'],
	category: ':mage: DM exclusive',
	async execute(message, args,dev,subjectMap,currency,client, campaignskeyv) {

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		const igitem = [];
		const jsonFiles3 = fs.readdirSync('./campaigns/').filter(file => file.endsWith('.json'));
	
		for (const file of jsonFiles3){
			const campaignName = file.substring(0, file.length-5).toLowerCase()
			try{
				const campaignContent = require('../campaigns/'+file);
				if(campaignContent.name==commandArgs || campaignContent.aliases.includes(commandArgs)){
					await campaignskeyv.set(message.guild.id, campaignContent.name)
					return message.channel.send(`Successfully set current campaign to __**${campaignContent.title}**__`);
				}
			}catch(error){
				console.error('There was an error at', error);
			}

		}
		return message.channel.send(`Campaign name of ${commandArgs} not found`);


	},
};