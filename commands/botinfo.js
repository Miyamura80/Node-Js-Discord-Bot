const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'botinfo',
	aliases: ['bot_info','bot-info'],
	description: 'Returns Bot Info',
	cooldown: 2,
	execute(message, args,dev) {
		try{
			 
			const feedback = new Discord.MessageEmbed()
			    .setColor([0, 0, 255])
			    .setFooter(`Bot created by ${dev.tag}.`, dev.displayAvatarURL)
			    .setDescription('Your text here.');
			message.channel.send(feedback)

		}catch(err){
			console.error(err)
		}


		// <${user.displayAvatarURL({ format: "png", dynamic: true })}>




	},
};

