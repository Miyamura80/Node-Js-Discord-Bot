const {prefix} = require('../config.json');


module.exports = {
	name: 'dmhelp',
	description: 'List all of my commands or info about a specific command in dm.',
	aliases: ['commandsdm',"dh"],
	usage: '[command name]',
	category: ':information_source: info',
	cooldown: 1,
	execute(message, args) {
		const data = []
		const {commands} = message.client;

		if(!args.length){
			data.push('**Here\'s a list of all my commands:**');
			//Just put them in a list
			data.push(commands.map(command => `\`${command.name}\``).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			//split argument ensures that if over 2000 character limit, will split it appropriately
			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`__**Name:**__ ${command.name}`);

		if (command.aliases) data.push(`__**Aliases:**__ ${command.aliases.join(', ')}`);
		if (command.description) data.push(`__**Description:**__ ${command.description}`);
		if (command.usage) data.push(`__**Usage:**__ \`${prefix}${command.name} ${command.usage}\``);

		data.push(`__**Cooldown:**__ ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};