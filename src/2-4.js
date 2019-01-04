const relay = require("../relay.js");
module.exports.run = async (bot, message, args, cube) => {
	let two = relay.twox();
	let three = relay.threex();
	let four = relay.fourx();
	return message.channel.send(`**2x2:**\n${two}\n\n**3x3:**\n${three}\n\n**4x4:**\n${four}`);
};
module.exports.config = { name: "2-4", aliases: [] };
