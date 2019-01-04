const relay = require("../relay.js");
module.exports.run = async (bot, message, args, cube) => {
	let four = relay.fourx();
	let five = relay.fivex();
	let six = relay.sixx();
	let seven = relay.sevenx();
	return message.channel.send(`**4x4:**\n${four}\n\n**5x5:**\n${five}\n\n**6x6:**\n${six}\n\n**7x7:**\n${seven}`);
};
module.exports.config = { name: "4-7", aliases: [] };
