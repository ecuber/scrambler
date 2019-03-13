const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let embed = new Discord.RichEmbed()
		.setTitle("Event List")
		.setColor("RANDOM")
		.setDescription(`The following list shows the proper ways to reference events for the \`s!compconfig\` or \`submit\` command. You can use any of the aliases to produce the same result. These are all cAsE iNsEnSiTiVe!`)
		.addField("No Aliases", "\n• 2x2\n• 3x3\n• 4x4\n• 5x5\n• 6x6\n• 7x7\n• clock\n• skewb\n• 2x2x3", true)
		.addField("Square-1", "• square-1\n• sq1\n• sq-1\n• squareone\n• square1\n• square_one\n• squan", true)
		.addField("One-Handed", ["oh", "onehanded", "onehand", "one-handed", "one-hand"].join("\n• "), true) // too lazy
		.addField("Pyraminx", "• pyra\n• pyraminx", true)
		.addField("Megaminx", "• mega\n• megaminx", true)
		.addField("Redi Cube", "• redi\n• redicube\n• redi-cube", true)
		.addField("Ivy Cube", "• ivy \n• ivycube\n• ivy-cube", true)
		.setTimestamp();
	message.channel.send(embed);
};
module.exports.config = { name: "events", aliases: ["eventlist"] };
