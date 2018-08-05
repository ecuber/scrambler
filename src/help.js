const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle("Help")
		.setDescription("For any of the commands below just type \`s!<command>\` (without the <>). For multiple scrambles, you can go \`s!<scramble> <number of scrambles>\`.\nDoing \`s!3x3 5\` will give you 5, 3x3x3 scrambles.")
		.addField("Scrambles", "2x2, 3x3, 4x4, 5x5, 6x6, 7x7, skewb, pyra, mega, sq1, clock")
		.addField("Utility", "info, ping, updates, prefix")
		.setTimestamp()
		.setFooter(`Scrambler`, bot.user.displayAvatarURL);
	try {
		await message.author.send(helpEmbed);
	} catch(err) {
		return message.channel.send("I was unable to send you a DM. Please check your privacy settings and ensure the bot isn't blocked.");
	}
	message.channel.send("Check your DM's! 📬");
};
module.exports.config = { name: "help", aliases: ["halp"] };
