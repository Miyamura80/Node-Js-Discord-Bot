const Discord = require('discord.js');
const { Users} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
module.exports = {
	name: 'leaderboard',
	description: `Display leaderboard for ${currencyUnit}`,
	aliases: ['lb'],
	category: ':money_with_wings: economy',
	execute(message, args,dev,subjectMap,currency,client) {

		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}${currencyUnit}`)
				.join('\n'),
			{ code: true }
		);

	},
};