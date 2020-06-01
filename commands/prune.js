module.exports = {
	name: 'prune',
	description: 'Deletes the last n messages.',
	args: true,
	usage: '<num>   \n<num> is number of latest messages to delete (does not delete messages older than 2 weeks)',
	execute(message, args) {
		const amount = parseInt(args[0])+1;

		if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		}else if (amount <= 1 || amount > 100) {
			return message.reply('you need to input a number between 2 and 100.');
		}else{
			message.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				message.channel.send('there was an error trying to prune messages in this channel!');
			});
		}
	},
};