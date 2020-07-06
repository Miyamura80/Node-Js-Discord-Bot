const Discord = require('discord.js');
const finduser = require(`../utilityFunc/finduser.js`);
const { Users, SoulLink, Characters, Shops, ShopListing, Items} = require('../dbObjects');
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

		const playerStat = new Discord.MessageEmbed()
				.setColor('#fc00fc')
				.setTitle(`${shopResult.title}`)
				.setAuthor('Spiral Bot', 'https://raw.githubusercontent.com/Miyamura80/Node-Js-Discord-Bot/master/botProfilePic.png', 'https://github.com/Miyamura80/Node-Js-Discord-Bot')
				.setDescription(`${shopResult.description}`)

		const shopDetails = [];
		for (const lst of listings){
			const item = await Items.findOne({ where: { item_id: lst.item_id } });
			const quantityStr = lst.infinite ? '' : `Amount: ${lst.amount}`
			if(lst.amount){
				shopDetails.push(`__${item.item_title}-(${item.rating} Rank):__ ${currencyUnit} ${lst.price} ${quantityStr}`);
			}
		}
		playerStat.addField('__**Listings:**__',shopDetails.join('\n'), true);

		return message.channel.send(playerStat);

	},
};