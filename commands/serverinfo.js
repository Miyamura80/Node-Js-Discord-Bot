module.exports = {
	name: 'serverinfo',
	description: 'Provides server info',
	guildOnly: true,
	category: 'info',
	execute(message, args) {
		message.channel.send(`This server: ${message.guild.name} \nTotal members: ${message.guild.memberCount}
			\nRegion: ${message.guild.region} \nCreation date: ${message.guild.createdAt}
			\nNotification Setting: ${message.guild.defaultMessageNotifications}`);
	},
};