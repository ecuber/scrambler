const relay = require("../relay.js");
module.exports.run = async (bot, message, args, cube) => {
	let two = relay.twox();
	let three = relay.threex();
	let four = relay.fourx();
	let five = relay.fivex();
	let six = relay.sixx();
	let seven = relay.sevenx();
	return message.channel.send(`**2x2:**\n${two}\n\n**3x3:**\n${three}\n\n**4x4:**\n${four}\n\n**5x5:**\n${five}\n\n**6x6:**\n${six}\n\n**7x7:**\n${seven}`);
};
module.exports.config = { name: "2-7", aliases: [] };
