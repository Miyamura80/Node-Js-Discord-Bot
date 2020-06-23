const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();


//Return all command file names in an array of string
const slapFiles = fs.readdirSync('./Images/Slap').filter(file => file.endsWith('.gif') || file.endsWith('.png') || file.endsWith('.jpg'));
module.exports = {
	name: 'slap',
	args: true,
	aliases: ['hit','thwip'],
	description: 'Hit another user',
	category: 'fun',
	usage: '<@Person>      \n(Target Person)',
	cooldown: 7,
	execute(message, args,dev) {
		try{
			// const target = message.guild.members.fetch(mem => mem.username == "Eimi");
			const target = message.mentions.users.map(user => {
				const rand = Math.floor(Math.random() * slapFiles.length)

				const exampleEmbed = new Discord.MessageEmbed()
					.setTitle(`${message.author.username} slapped ${user.username}`)
					.attachFiles(['./Images/Slap/'+slapFiles[rand]])
					.setImage('attachment://'+slapFiles[rand]);
				message.channel.send(exampleEmbed);
			});



		}catch(err){
			console.error(err)
		}


		




	},
};

