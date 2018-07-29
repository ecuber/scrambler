const Discord = require("discord.js");

module.exports.run = async (bot, message, args, cube) => {
	let helpEmbed = new Discord.RichEmbed()
		.setAuthor(bot.user.username, bot.user.displayAvatarURL)
		.setColor("7289DA")
		.addField(`Commands`, "These are all the commands Scrambler has! For scramblers, simply type !<command> and Scrambler will send a scramble in the chat.")
		.addField("Scramblers", "2x2, 3x3, 4x4, 5x5, skewb, pyra, mega, sq1, clock")
		.addField("Utility", "info, ping, updates, prefix (mods only)")
		.setTimestamp()
		.setFooter(`Scrambler`, bot.user.displayAvatarURL);
	try {
		await message.author.send(helpEmbed);
	} catch(err) {
		return message.channel.send("I was unable to send you a DM. Please check your privacy settings and ensure the bot isn't blocked.");
	}
	message.channel.send("Check your DM's! 📬").then(msg => msg.delete(4000));
};
module.exports.config = { name: "help", aliases: ["halp"] };
