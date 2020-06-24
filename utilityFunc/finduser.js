const {prefix} = require("../config.json");
module.exports = {
	name: 'finduser',
	description: 'Utility function which returns a user based on name. Returns exactly one or none',
	async execute(message,commandArgs) {


		if(!message.mentions.users.size){
			const member = await message.guild.members.fetch({ query: commandArgs})
			const user = member.first().user
			return user

		}

		return message.mentions.users.first()


	},
};