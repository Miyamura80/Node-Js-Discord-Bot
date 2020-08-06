const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters, Shops, ShopListing, Items, CharItems} = require('../dbObjects');
const {prefix,currencyUnit} = require("../config.json")
const { Op } = require('sequelize');
module.exports = {
	name: 'shop',
	description: 'Display whats selling in the shop you are in',
	usage: '<name>   \n<name> is the name of the shop you want to view',
	category: ':money_with_wings: economy',
	async execute(message, args,dev,campaignWikiMap,currency,client, campaignskeyv) {
		const cpnNow = await campaignskeyv.get(message.guild.id)

		const subjectMap = campaignWikiMap.get(cpnNow);

		if(!args.length){
			const shopDBObjs = await Shops.findAll();
			return message.channel.send(shopDBObjs.map(shop => `${shop.shop_title} : __**${shop.shop_name}**__`).join('\n'));
		}

		const input = message.content.slice(prefix.length).trim();
		const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);


		const sShop = await Shops.findOne({ where: { shop_name: { [Op.like]: commandArgs } } });
		if (!sShop) return message.channel.send(`Sorry ${message.author}, that's an invalid shop name.`);

		
		const shopResult = subjectMap.get(sShop.shop_name) || subjectMap.find(sbj => sbj.aliases && sbj.aliases.includes(sShop.shop_name));


		const listings = await ShopListing.findAll({
			where: { shop_id: sShop.shop_id }
		});

		if(!listings.length){
			return message.channel.send(`The shop you selected has no items being sold ${message.author}!`);
		}

		const shopEmbed = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`${shopResult.title}`)
				.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
				.setDescription(`${shopResult.description}`)

		const shopDetails = [];
		var itemNumber = 1;
		for (const lst of listings){
			const item = await Items.findOne({ where: { item_id: lst.item_id } });
			const quantityStr = lst.infinite ? '' : `Amount: ${lst.amount}`
			if(lst.amount){
				shopDetails.push(`[\`${item.item_name}\`][${itemNumber}] __${item.item_title}-(${item.rating} Rank):__ ${currencyUnit} ${lst.price} ${quantityStr}`);
			}
			itemNumber += 1
		}
		shopEmbed.addField('__**Listings:**__',shopDetails.join('\n'), true);

		const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟']

		message.channel.send(shopEmbed).then(sentEmbed =>{
			if(shopDetails){
				const itemNames = []
				var i = 0;
				const n = shopDetails.length;
				while(i<n && i < 10){
					const itemName = shopDetails[i].match(/\[(.*?)\]/g)[0].slice(2,-1).slice(0,-1);
					itemNames.push(itemName);
					sentEmbed.react(emojis[i]);
					i += 1;
				}
				sentEmbed.react(`❌`);

				const filter = (reaction, user) => {
					return  (reaction.emoji.name==`❌`|| emojis.includes(reaction.emoji.name)) && !(user.bot)
				};

				const collector = sentEmbed.createReactionCollector(filter, {time: 300000, max: 10})

				collector.on('collect', async (reaction, user) => {
					if(`❌`==reaction.emoji.name){
						collector.stop();
						return message.channel.bulkDelete(1, true).catch(err => {
							console.error(err);
							message.channel.send('there was an error trying to prune messages in this channel!');
						});
					}


					//commandargs is shop name
					//itemName is associated item indexed i
					i = 0;
					while(emojis[i]!=reaction.emoji.name){
						i += 1;
					}
					console.log(itemNames[i]);
					const itemDB = await Items.findOne({ where: { item_name: { [Op.like]: itemNames[i] } } });
					//sshop is shop DB object
					const soulLinkForUser = await SoulLink.findOne({ where: { user_id: message.author.id, campaign: cpnNow } });
					if(!soulLinkForUser){
						return message.channel.send(`Sorry ${message.author}! You do not have a character assigned to you`);
					}
					const chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });
					const listing = await ShopListing.findOne({where: {item_id: itemDB.item_id, shop_id: sShop.shop_id}});

					const cost = listing.price
					if(cost > chr.balance) return message.channel.send(`Your character ${chr.char_title} does not have enough to buy the item ${message.author}! You need ${currencyUnit}${cost-chr.balance} more`);

					if(listing.infinite || listing.amount >= 1){
						await chr.addItem(itemDB, 1);
						chr.balance -= cost;
						chr.save();
						await sShop.addItem(itemDB, -1, listing.infinite);
						const charItemDB = await CharItems.findOne({where: {item_id: itemDB.item_id, char_id: chr.char_id}})
						return message.channel.send(`Successfully bought __**${itemNames[i]}**__ from __**${commandArgs}**__. \n__**Total number in your inventory:**__ ${charItemDB.amount} \n__**Remaining balance:**__ ${currencyUnit} ${chr.balance} `); 
					}
					
					return message.channel.send(`The shop ${shopName} doesn't have any more stock of ${itemName}`);

				});

				collector.on('end', (reaction,user) => {
					sentEmbed.reactions.removeAll()
					sentEmbed.delete()
				});
			}
		});


		

	},
};