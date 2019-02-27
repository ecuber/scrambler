const fs = require("fs");
module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(!args[0] || args[0] == "help") return message.channel.send("Usage: `s!prefix <desired prefix OR reset>`.\nExample: to set prefix to \`?\`, do \`s!prefix ?\`. To reset afterwards, do \`s!prefix reset\`");
	if(args[0] == "reset") {
		bot.guildSettings[message.guild.id].prefix = null;
		await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4), err => {
			if(err) throw err;
		});
		return message.channel.send(`Okay, I have reset your prefix to \`${bot.settings.prefix}\``);
	} else {
		bot.guildSettings[message.guild.id].prefix = args[0];
		await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4), err => {
			if(err) throw err;
		});
		return message.channel.send(`Okay, I have set your prefix to \`${args[0]}\` To reset your prefix, do \`${args[0]}prefix reset\``);
	}
};
module.exports.config = { name: "prefix", aliases: [] };
