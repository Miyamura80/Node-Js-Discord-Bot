const {prefix} = require("../config.json");
module.exports = {
	name: 'finduser',
	description: 'Utility function which returns a user based on name. Returns exactly one or none',
	async execute(message,commandArgs) {


		if(!message.mentions.users.size){
			const member = await message.guild.members.fetch({ query: commandArgs})
			if(member.size){
				const user = member.first().user
				return user
			}else{
				console.log('Member not fo')
				return null
			}

		}

		return message.mentions.users.first()


	},
};