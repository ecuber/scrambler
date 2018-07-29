const Discord = require("discord.js");
const fs = require("fs");
module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(!args[0] || args[0] == "help") return message.channel.send("Usage: `!prefix <desired prefix **OR** reset>`. Example: to set prefix to \`?\`, do \`!prefix ?\`. To reset afterwards, use the prefix you just set e.g. \`?prefix reset\`");
	if(args[0] == "reset") {
		bot.prefixes[message.guild.id] = { prefix: "!" };
		await fs.writeFile("./prefixes.json", JSON.stringify(bot.prefixes, null, 4), err => {
			if(err) throw err;
		});
		return message.channel.send(`I have reset your prefix to \`!\``);
	} else {
		bot.prefixes[message.guild.id] = { prefix: args[0] };
		await fs.writeFile("./prefixes.json", JSON.stringify(bot.prefixes, null, 4), err => {
			if(err) throw err;
		});
		return message.channel.send(`I have set your prefix to \`${args[0]}\`. To reset your prefix, perform \`${args[0]}prefix reset\``);
	}
};

module.exports.config = { name: "prefix", aliases: [] };
