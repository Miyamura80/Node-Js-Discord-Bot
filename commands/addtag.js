module.exports = {
	name: 'addtag',
	description: 'Add a tag to specified name',
	category: 'debug',
	args: true,
	usage: '<num>   \n<num> is number of latest messages to delete (does not delete messages older than 2 weeks)',
	cooldown:0.2,
	execute(message, args, dev, subjMap, Tags) {

		const input = message.content.slice(PREFIX.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		const splitArgs = commandArgs.split(' ');
		const tagName = splitArgs.shift();
		const tagDescription = splitArgs.join(' ');

		// try {
		// 	// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
		// 	const tag = await Tags.create({
		// 		name: tagName,
		// 		description: tagDescription,
		// 		username: message.author.username,
		// 	});
		// 	return message.reply(`Tag ${tag.name} added.`);
		// }
		// catch (e) {
		// 	if (e.name === 'SequelizeUniqueConstraintError') {
		// 		return message.reply('That tag already exists.');
		// 	}
		// 	return message.reply('Something went wrong with adding a tag.');
		// }
	},
};