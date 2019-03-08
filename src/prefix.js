const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args, cube) => {
	return message.channel.send("Scrambler's management features are not funcitonal at the moment. Apologies for the inconvenience.");
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(!args[0] || args[0] == "help") {
		if(!args[0] || args[0] == "help") {
			let helpEmbed = new Discord.RichEmbed()
				.setTitle(`${bot.settings.prefix}prefix`)
				.setColor("RANDOM")
				.setDescription("Usage: s!prefix <desired prefix OR reset>")
				.addField("Example", `To set your prefix to \`?\`, do \`${bot.settings.prefix}prefix ?\``, true)
				.addBlankField(true)
				.addField("Resetting your prefix", `Simply type \`${bot.settings.prefix}prefix reset\``, true)
				.addField("Documentation", "https://scrambler.gitbook.io/docs/util/prefix")
				.setTimestamp()
				.setFooter(`Scrambler`, bot.user.displayAvatarURL);
			return message.channel.send(helpEmbed);
		}
	}
	if(args[0] == "reset") {
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { prefix: "" } }, { upsert: true });
		return message.channel.send(`Okay, I have reset your prefix to \`${bot.settings.prefix}\``);
	} else {
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { prefix: args[0] } }, { upsert: true });
		return message.channel.send(`Okay, I have set your prefix to \`${args[0]}\` To reset your prefix, do \`${args[0]}prefix reset\``);
	}
};
module.exports.config = { name: "prefix", aliases: ["setprefix"] };
