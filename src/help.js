const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("Help")
		.setDescription("For any of the commands below just type \`s!<command>\` (without the <>).\n\nFor more help with other commands, simply add \" help\" after the command.")
		.addField("WCA", "2x2, 3x3, 4x4, 5x5, 6x6, 7x7, skewb, pyra, mega, sq1, clock", true)
		.addField("Non-WCA", "redi, ivy, 2x2x3", true)
		.addField("Multi-Scramble", "To get multiple scrambles, you can do \`s!<scramble> <number of scrambles>\`. For example, doing \`s!3x3 5\` will give you 5, 3x3x3 scrambles.")
		.addField("Relays", "2-4, 2-5, 2-6, 2-7, 4-7, 5-7, mini (guildford), side (events)\n\nThese will generate several scrambles for different puzzles depending on the relay type.", true)
		.addField("Utility", "prefix, ignore, ignored, updates, stats, info, ping", true)
		.setTimestamp()
		.setFooter(`${bot.user.username}`, bot.user.displayAvatarURL);
	message.channel.send(helpEmbed);
};
module.exports.config = { name: "help", aliases: ["relay"] };
