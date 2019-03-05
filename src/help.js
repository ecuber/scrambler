const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("Help")
		.setDescription("For any of the commands listed below just type \`s!<command>\` (without the <>). For example, s!2x2 will generate a 2x2 scramble, s!redi will generate a redi cube scramble, etc.\n\nFor more help with utility commands, simply add \" help\" after the command.")
		.addField("WCA", "2x2, 3x3, 4x4, 5x5, 6x6, 7x7, skewb, pyra, mega, sq1, clock")
		.addField("Non-WCA", "redi, ivy, 2x2x3")
		.addField("Multi-Scramble", "To get multiple scrambles, you can do \`s!<scramble> <number of scrambles>\`. For example, doing \`s!3x3 5\` will give you 5, 3x3x3 scrambles.")
		.addField("Relays", "2-4, 2-5, 2-6, 2-7, 4-7, 5-7, guildford, side\nThese will generate the scrambles for multiple types of puzzles depending on the relay type.", true)
		.addField("Utility", "prefix, ignore, ignored, updates, stats, info, ping", true)
		.addField("Comps", "submit, manageresults, compconfig, config, comp, events")
		.addField("Gifs", "jay, egg", true)
		.addField("Documentation", "For detailed instructions on using any of these commands, check out the documentation! https://scrambler.gitbook.io/docs/")
		.setTimestamp()
		.setFooter(`${bot.user.username}`, bot.user.displayAvatarURL);
	message.channel.send(helpEmbed);
};
module.exports.config = { name: "help", aliases: ["relay"] };
