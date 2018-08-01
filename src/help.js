const Discord = require("discord.js");

module.exports.run = async (bot, message, args, cube) => {
	let helpEmbed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.addField(`Commands`, "These are all the commands scrambler has! For scrambles, simply type s!<command> and scrambler will send a scramble in the chat.")
		.addField("Scrambles", "2x2, 3x3, 4x4, 5x5, 6x6, 7x7, skewb, pyra, mega, sq1, clock")
		.addField("Utility", "info, ping, updates, prefix")
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
