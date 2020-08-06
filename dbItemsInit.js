const Sequelize = require('sequelize');
const fs = require('fs');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('Database/models/CurrencyShop');
const Characters = sequelize.import('Database/DND/Characters');
const Items = sequelize.import('Database/DND/Items');
const Shops = sequelize.import('Database/DND/Shops');



sequelize.import('Database/DND/CharItems');
sequelize.import('Database/DND/ShopListing');
sequelize.import('Database/DND/SoulLink');
sequelize.import('Database/models/Users');
sequelize.import('Database/models/UserItems');
sequelize.import('Database/DND/Parties');
sequelize.import('Database/DND/PartyMatch');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
	//Upsert is a combination of insert and update
	//will not create duplicate data, and will update values
	//not necessary, since defined name as unique, but better safe than sorry 
		CurrencyShop.upsert({ name: 'Tea', cost: 1 }), 
		CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
	];
	await Promise.all(shop);

	
	//Loading items into database
	const igitem = [];
	const jsonFiles3 = fs.readdirSync('./WikiJsons/spiral/'+'Items'+'/').filter(file => file.endsWith('.json'));
	
	for (const file of jsonFiles3){
		try{
			const subjContent = require('./WikiJsons/spiral/'+'Items'+'/'+file);
			igitem.push(Items.upsert({ item_name: subjContent.name, 
				item_title: subjContent.title,
				description: subjContent.description,
				num_limit: subjContent.num_limit,
				rating: subjContent.rating,
				trivia: subjContent.trivia,
				col_value: subjContent.col_value,
				sc_value: subjContent.sc_value,
				woth_value: subjContent.woth_value,
				cotm_value: subjContent.cotm_value
			}));
		}catch(error){
			console.log(error)
		}
	}
	await Promise.all(igitem)

	//Loading shops into database
	const igshop = [];
	const jsonFiles = fs.readdirSync('./WikiJsons/spiral/'+'Shops'+'/').filter(file => file.endsWith('.json'));
	
	for (const file of jsonFiles){
		try{
			const subjContent = require('./WikiJsons/spiral/'+'Shops'+'/'+file);
			igshop.push(Shops.upsert({ shop_name: subjContent.name, 
				shop_title: subjContent.title,
				description: subjContent.description,
				location: subjContent.location,
				allegiance: subjContent.allegiance,
				owner: subjContent.owner,
				campaign: 'spiral'
			}));
		}catch(error){
			console.log(error)
		}
	}
	await Promise.all(igshop)

	

	console.log('Database synced');
	sequelize.close();
}).catch(console.error);