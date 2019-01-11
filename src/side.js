const relay = require("../relay.js");
module.exports.run = async (bot, message, args, cube) => {
	let clock = relay.clockx();
	let pyra = relay.pyrax();
	let skewb = relay.skewbx();
	let squan = relay.squanx();
	let mega = relay.megax();
	message.channel.send(`**Clock:**\n${clock}\n\n**Pyraminx:**\n${pyra}\n\n**Skewb:**\n${skewb}\n\n**Square-One**\n${squan}\n\n**Megaminx:**${mega}`);
};
module.exports.config = { name: "side", aliases: ["sideevents", "side-events"] };
