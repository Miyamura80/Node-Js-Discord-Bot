module.exports = {
	name: 'user-info',
	aliases: ['userinfo'],
	description: 'Returns the details about the user',
	category: 'info',
	usage: '<@Person>      \n(Person specified to oneself by default)',
	cooldown: 5,
	execute(message, args) {

		if (!message.mentions.users.size) {
			message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			message.channel.send(`Your username: ${user.username}\nYour ID: ${user.id}`)
			return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
		});

		// send the entire array of strings as a message
		// by default, discord.js will `.join()` the array with `\n`
		message.channel.send(avatarList);
	},
};