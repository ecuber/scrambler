const Discord = require("discord.js");
const fs = require("fs");
module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(args[0] == "help" || !args[0]) {
		return message.channel.send("Usage: `s!restrict <#channel>`. (Mention the channel you'd like to ignore, without the <>.) This will toggle the ability to use scrambler commands in the channel.");
	} else {
		let guildID = message.guild.id;
		let channelID = message.mentions.channels.first().id;
		if(bot.guildSettings[guildID].ignoredChannels.includes(channelID)) {
			let indexChannel = bot.guildSettings[guildID].ignoredChannels.indexOf(channelID);
			bot.guildSettings[guildID].ignoredChannels.splice(indexChannel, 1);
			await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4, err => {
				if(err) throw err;
			}), err => {
				if(err) console.log(`Error writing to guildSettings:\n${err.stack}`);
			});
			return message.channel.send(`I will no longer ignore commands in \`#${message.mentions.channels.first().name}\`. To undo, simply do \`s!restrict #${message.mentions.channels.first().name}\`.`);
		} else {
			bot.guildSettings[guildID].ignoredChannels.push(channelID);
			await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4), err => {
				if(err) throw err;
			}, err => {
				if(err) console.log(`Error writing to guildSettings:\n${err.stack}`);
			});
			return message.channel.send(`I will now ignore commands in \`#${message.mentions.channels.first().name}\`. To undo, simply do \`s!restrict #${message.mentions.channels.first().name}\`.`);
		}
	}
};

module.exports.config = { name: "restrict", aliases: [] };
