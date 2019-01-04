const relay = require("../relay.js");
module.exports.run = async (bot, message, args, cube) => {
	let two = relay.twox();
	let three = relay.threex();
	let four = relay.fourx();
	let five = relay.fivex();
	let oh = relay.threex();
	let clock = relay.clockx();
	let pyra = relay.pyrax();
	let skewb = relay.skewbx();
	let squan = relay.squanx();
	let mega = relay.megax();
	// begin the mayhem
	message.channel.send(`***Mini-Guildford***\n\n**2x2:**\n${two}\n\n**3x3:**\n${three}\n\n**4x4:**\n${four}\n\n**5x5:**\n${five}\n\n**One-Hand:**\n${oh}\n\n`);
	message.channel.send(`**Clock:**\n${clock}\n\n**Pyraminx:**\n${pyra}\n\n**Skewb:**\n${skewb}\n\n**Square-One**\n${squan}`);
	return message.channel.send(`\n\n**Megaminx:**${mega}`);
};
module.exports.config = { name: "mini", aliases: ["mg", "mini-guildford", "mini-guilford", "miniguilford", "miniguildford"] };
