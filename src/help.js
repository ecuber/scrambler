const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("Help")
		.setDescription("For any of the commands below just type \`s!<command>\` (without the <>).\n\nFor more help with other commands, simply add \" help\" after the command.")
		.addField("WCA", "2x2, 3x3, 4x4, 5x5, 6x6, 7x7, skewb, pyra, mega, sq1, clock")
		.addField("Non-WCA", "redi, ivy, 2x2x3\n\nTo get multiple scrambles, you can do \`s!<scramble> <number of scrambles>\`. For example, doing \`s!3x3 5\` will give you 5, 3x3x3 scrambles.")
		.addField("Relays", "2-4, 2-5, 2-6, 2-7, 4-7, 5-7, mini, side\nmini: Mini Guildford\nside: Side events\n\nThis will generate several scrambles for different puzzles depending on the relay type.", true)
		.addField("Utility", "info, ping, updates, prefix, restrict", true)
		.setTimestamp()
		.setFooter(`Scrambler`, bot.user.displayAvatarURL);
	message.channel.send(helpEmbed);
};
module.exports.config = { name: "help", aliases: ["relay"] };
