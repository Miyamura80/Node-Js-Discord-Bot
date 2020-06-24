module.exports = {
	name: 'roll',
	description: 'Roll a dice of whatever dice you want! (even ones tha)',
	cooldown:1,
	aliases: ['r'],
	category: ':game_die: utility',
	usage: '<dice dimension> <roll number>   \n<dice dimension> is how many sided dice you want (e.g. d20) \n <roll number> is the number of times you want to roll. It is set to 1 by default ',
	execute(message, args) {
		var num = 0
		if(args[0].startsWith('d') && args[0].length >= 2){
			num = parseInt(args[0].substring(0,args[0].length-2));
		}else{
			num = parseInt(args[0])
		}

		if(isNaN(num)){
			message.channel.send(`Please enter a valid number!`);
			return
		}

		if(args[1]){
			var sum = 0;
			var results = []
			const numRoll = parseInt(args[1])

			for(var i=0; i < numRoll; i++){
				const result = Math.floor(Math.random() * num) + 1
				sum += result
				results.push(result)
			}	
			message.channel.send(`You rolled: __**${results}**__ with a total sum of: __**${sum}**__`)
			return
		}
		


		const result = Math.floor(Math.random() * num) + 1
		
		if(result==1){
			message.channel.send(`Catastrophe is coming... you rolled a ||${result}|| :fearful:`);	
		}else if(result==20){
			message.channel.send(`A miraculous __**${result}**__! :angel:`);
		}else{
			message.channel.send(`The number you rolled is __**${result}**__!!!`);
		}
		
	},
};