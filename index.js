const {prefix, token} = require("./config.json");
//require discord.js module
const Discord = require('discord.js');
const client = new Discord.Client();


//once logged in
//once -> trigger once
client.once('ready', () => {
	console.log('Ready!');
});

//on -> trigger multiple times
client.on('message', message => {
	if (message.content.startsWith('${prefix}ping')) {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	} else if (message.content.startsWith('${prefix}ping2')){

	}
});



client.login(token);