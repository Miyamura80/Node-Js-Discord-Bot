const Discord = require('discord.js');
const {CurrencyShop, Users} = require('../dbObjects');
const fs = require('fs');
const {prefix,currencyUnit,defaultCampaign} = require("../config.json")
module.exports = {
    name: 'currentcampaign',
    description: 'Displays information about the current campaign',
    dmonly: true,
    aliases: ['current_campaign'],
    category: ':mage: DM exclusive',
    async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
        const devUrl = dev.displayAvatarURL({ format: "png", dynamic: true })
    
        try{
            let cmpName;
            const cpnNow = await campaignskeyv.get(message.guild.id)
            if(cpnNow){
                cmpName = cpnNow
            }else{
                cmpName = defaultCampaign
            }
            //Short for current campaign content 
            const ccc = require('../campaigns/'+cmpName+'.json')
            
            const author = await client.users.cache.get(ccc.authorid)
            const authorUrl = author.displayAvatarURL({ format: "png", dynamic: true })

            const currentCampaign = new Discord.MessageEmbed()
                .setColor('#fc00fc')
                .setTitle(`__**${ccc.title}**__`)
                .setAuthor(`Author: ${ccc.author}`, authorUrl)
                .setDescription(ccc.description)
                .setFooter('Please help improving this wiki by messaging Eimi for any errors, typos, corrections', devUrl)
                .addField('__**Credits**__',ccc.credits)

            message.channel.send(currentCampaign);
        	
        }catch(error){
            console.error('Error in currentcampaign', error);
        }



    },
};