module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: ':bug: debug',
	cooldown:0.2,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};