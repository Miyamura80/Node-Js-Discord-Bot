module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: 'debug',
	cooldown:0.2,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};