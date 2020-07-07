const {prefix} = require("../config.json");
const {SoulLink, Characters} = require('../dbObjects.js');
module.exports = {
	name: 'getusercharacter',
	description: 'Utility function which returns a character associated with user. Either returns null or the character',
	async execute(message,campaignskeyv,userObj) {

		const cpnNow = await campaignskeyv.get(message.guild.id)

		const soulLinkForUser = await SoulLink.findOne({ where: { user_id: userObj.id, campaign: cpnNow } });
		if(!soulLinkForUser){
			return null;
		}
		const chr = await Characters.findOne({ where: { char_id: soulLinkForUser.char_id} });

		return chr

	},
};