const {prefix} = require("../config.json");
const finduser = require(`../utilityFunc/finduser.js`);
module.exports = {
	name: 'user-info',
	aliases: ['userinfo'],
	description: 'Returns the details about the user',
	category: ':information_source: info',
	usage: '<@Person>      \n(Person specified to oneself by default)',
	cooldown: 5,
	async execute(message, args,dev,subjectMap,currency,client) {

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

		if (!commandArgs) {
			message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
		}

		const user = await finduser.execute(message,commandArgs)
		
		if(!user){
			return message.channel.send('User not found');
		}

		message.channel.send(`Your username: ${user.username}\nYour ID: ${user.id}`)
		return message.channel.send(`${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`);


	},
};