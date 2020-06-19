const Discord = require('discord.js');

module.exports = {
	name: 'highlow',
	description: 'Guess if a number is higher or lower',
	cooldown:1,
	aliases: ['hl'],
	usage: '<dice dimension> <roll number>   \n<dice dimension> is how many sided dice you want (e.g. d20) \n <roll number> is the number of times you want to roll. It is set to 1 by default ',
	execute(message, args) {

		const filter = m => m.content.includes('high') || m.content.includes('low');
		const collector = message.channel.createMessageCollector(filter, { time: 15000 , max: 1});

		const hiddenNum = Math.floor(Math.random() * 100) + 1
		var pivot = Math.floor(Math.random() * 100) + 1
		if (pivot==hiddenNum){
			pivot -= 1;
		}
		const isHigher = hiddenNum > pivot;
		const prompt = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`The number selected is ${pivot}`)
				.setDescription(`will the next number be higher or lower?`)
				.setFooter('Randomly selects a number between 0 to 100');
		message.channel.send(prompt);


		collector.on('collect', m => {
			if(m.content.includes('high') && isHigher || m.content.includes('low') && !isHigher){
				message.channel.send(`The number selected was ${hiddenNum} congrats!`);
			}else{
				message.channel.send(`The number selected was ${hiddenNum} you lose.`);
			}
			collector.stop();
		});




		
	},
};