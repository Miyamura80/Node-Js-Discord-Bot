const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('Database/models/CurrencyShop');
sequelize.import('Database/models/Users');
sequelize.import('Database/models/UserItems');

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
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);