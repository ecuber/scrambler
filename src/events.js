const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let events = ["2x2", "3x3", "4x4", "5x5", "6x6", "7x7", "oh", "clock", "pyra", "mega", "skewb", "squareone", "redi", "2x2x3", "ivy"];
	let embed = new Discord.RichEmbed()
		.setTitle("Event List")
		.setColor("RANDOM")
		.setDescription(`The following list shows the proper way to reference events for the \`s!compconfig\` command. Any other spellings will not give the expected result.\n\n• ${events.join("\n• ")}`, true)
		.setTimestamp();
	message.channel.send(embed);
};
module.exports.config = { name: "events", aliases: ["eventlist"] };
