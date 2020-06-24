module.exports = {
	name: 'updatewiki',
	description: 'Reloads Wiki Content for given subject',
	args: true,
	aliases: ['upw','updateWiki'],
	category: ':bug: debug',
	execute(message, args, dev, subjectMap) {
		const subjectName = args[0].toLowerCase();
		const subject = subjectMap.get(subjectName) || subjectMap.find(sbj => sbj.aliases && sbj.aliases.includes(subjectName));

		if (!subject) return message.channel.send(`There is no subject with name or alias \`${subjectName}\`, ${message.author}!`);

		console.log(subject.name)

		delete require.cache[require.resolve(`../WikiJsons/${subject.type}/${subject.name}.json`)];

		try {
			const newSubject = require(`../WikiJsons/${subject.type}/${subject.name}.json`);
			subjectMap.set(newSubject.name, newSubject);
		} catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading \`${subject.name}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Subject \`${subject.name}\` reload complete.`);


	},
};