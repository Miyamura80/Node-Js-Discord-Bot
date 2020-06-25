const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix} = require("../config.json")
const finduser = require(`../utilityFunc/finduser.js`);

//Return all command file names in an array of string
const slapFiles = fs.readdirSync('./Images/Slap').filter(file => file.endsWith('.gif') || file.endsWith('.png') || file.endsWith('.jpg'));
module.exports = {
	name: 'slap',
	args: true,
	aliases: ['hit','thwip'],
	description: 'Hit another user',
	category: ':partying_face: fun',
	usage: '<@Person>      \n(Target Person)',
	cooldown: 7,
	async execute(message, args,dev) {
		try{

			if(message.mentions.users.size){
				const target = message.mentions.users.map(user => {
				const rand = Math.floor(Math.random() * slapFiles.length)

				const exampleEmbed = new Discord.MessageEmbed()
					.setTitle(`${message.author.username} slapped ${user.username}`)
					.attachFiles(['./Images/Slap/'+slapFiles[rand]])
					.setImage('attachment://'+slapFiles[rand]);
				message.channel.send(exampleEmbed);
				});
				return
			}

			const input = message.content.slice(prefix.length).trim();
			const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

			const user = await finduser.execute(message,commandArgs);
			if(!user && !message.mentions.users.size){
				return message.channel.send(`User not found`);
			}



			const rand = Math.floor(Math.random() * slapFiles.length)
			const exampleEmbed = new Discord.MessageEmbed()
					.setTitle(`${message.author.username} slapped ${user.username}`)
					.attachFiles(['./Images/Slap/'+slapFiles[rand]])
					.setImage('attachment://'+slapFiles[rand]);
			return message.channel.send(exampleEmbed);




		}catch(err){
			console.error(err)
		}


		




	},
};

