const fs = require('fs');
//Node's native file system module
const {prefix, token} = require("./config.json");
//require discord.js module
const Discord = require('discord.js');
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const client = new Discord.Client();

client.commands = new Discord.Collection();


//Currency
const currency = new Discord.Collection();
//Helper methods for currency 
Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});


//Return all command file names in an array of string
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

const cooldowns = new Discord.Collection();

var dev = null;

//once logged in
//once -> trigger once
client.once('ready', async () => {
	console.log('Ready!');
	const devID = '270972813739819009'
	client.user.setActivity(`with the world | ${prefix}help`, {
	  type: "PLAYING"
	});
	dev = client.users.cache.get(devID)

	//sync currency collection with database for easy access later
	const storedBalances = await Users.findAll();
	// const storedBalances = await Users.findAll()
	storedBalances.forEach(b => currency.set(b.user_id, b));

});


//LOADING FILES
const categories = ["Characters", "Groups", "Items", "Locations", "Concepts"]
const subjectMap = new Discord.Collection();

for(const categ of categories){
	console.log("------------------------------------------------");
	console.log("Loading: "+categ);
	const jsonFiles = fs.readdirSync('./WikiJsons/'+categ+'/').filter(file => file.endsWith('.json'));
	
	for (const file of jsonFiles){
		const subjName = file.substring(0, file.length-5).toLowerCase()
		console.log("Loaded Wiki for: "+subjName);
		try{
			const subjContent = require('./WikiJsons/'+categ+'/'+file);
			subjectMap.set(subjName, subjContent);
		}catch(error){
			console.log(error)
		}
	}
}






//MAIN SEQUENCE
//on -> trigger multiple times
client.on('message', message => {
	if(!message.author.bot){
		currency.add(message.author.id, 1);
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	//Argument cleanup
	const args = message.content.slice(prefix.length).split(/ +/);   //This splits by continued blanks, not just by ' '
	const commandName = args.shift().toLowerCase();

	//Get the command object (either by name || by alias)
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

	//If no command found, return
	if(!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	//If command requires arguments
	if(command.args && !args.length){
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if(command.usage){
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	//If command not on cooldown
	if(!cooldowns.has(command.name)){
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000

	if(timestamps.has(message.author.id)){
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if(now < expirationTime){
			const timeLeft = (expirationTime - now)/1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}else{
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}


	//Main command execution
	try{
		command.execute(message, args,dev,subjectMap,currency);
	}catch (error){
		console.error(error);
		message.reply('There was an error trying to execute that command!')
	}



	
});



//For personal reference, things specifiable to commands are:
/*
args :: Bool
guildOnly :: Bool
cooldown :: Double (in seconds)
usage :: String
*/

client.login(token);