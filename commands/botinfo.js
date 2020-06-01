const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'botinfo',
	aliases: ['bot_info','bot-info'],
	description: 'Returns Bot Info',
	cooldown: 2,
	execute(message, args,dev) {
		try{
			const devUrl = dev.displayAvatarURL({ format: "png", dynamic: true })
			const embed = {
			  "title": "**Providing utility functions for the world of Spirals of Dietheld**",
			  "description": "Spirals of Dietheld is an original fantasy world built by Eimi. Inspired lightly by dark souls and various other nerdy stuff. ```\nSo hey, lets enjoy the journey.```",
			  "url": "https://github.com/Miyamura80/Node-Js-Discord-Bot",
			  "color": 2540581,
			  "timestamp": "2020-06-01T13:34:12.150Z",
			  "footer": {
				"icon_url": devUrl,
				"text": "Developed by Eimi. Made at"
			  },
			  "thumbnail": {
				"url": "https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png"
			  },
			  "author": {
				"name": "Spiral Bot",
				"url": "https://github.com/Miyamura80/Node-Js-Discord-Bot",
				"icon_url": "https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png"
			  },
			  "fields": [
				{
				  "name": "**Source Code:**",
				  "value": "[Github](https://github.com/Miyamura80/Node-Js-Discord-Bot)",
				  "inline": true
				},
				{
				  "name": "**Version:**",
				  "value": "1.0.1",
				  "inline": true
				},
				{
				  "name": "**Hosting:**",
				  "value": "[Raspberry Pi 2B](https://www.raspberrypi.org) on my desk",
				  "inline": true
				},
				{
				  "name": "**Built with:**",
				  "value": "[Node js](https://nodejs.org/en/)",
				  "inline": true
				},
				{
				  "name": "** :warning: WARNING:**",
				  "value": "The github repository contains spoilers",
				  "inline": true
				}

			  ]
			};
			message.channel.send({embed});
			// const feedback = new Discord.MessageEmbed()
			// 	.setColor([0, 0, 255])
			// 	.setFooter(`Bot created by ${dev.tag}.`, dev.displayAvatarURL)
			// 	.setDescription('Your text here.');
			// message.channel.send(feedback)

		}catch(err){
			console.error(err)
		}


		




	},
};

