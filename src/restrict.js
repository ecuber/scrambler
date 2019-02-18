const Discord = require("discord.js");
const fs = require("fs");
module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(args[0] == "help" || !args[0]) {
		return message.channel.send("Usage: `s!restrict <#channel | reset | all <#optional #exempted #channels> >`. (Mention the channel you'd like to ignore, without the <>.) This will toggle the ability to use scrambler commands in the channel. Reset will remove all previously restricted commands. \nRunning \`s!restrict all\` will restrict all channels on the server. If you would like to exempt some channels from this command, simply add them to the end.");
	}
	if(args[0] == "reset") {
		bot.guildSettings[message.guild.id].ignoredChannels.length = 0;
		await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4, err => {
			if(err) throw err;
		}), err => {
			if(err) console.log(`Error writing to guildSettings:\n${err.stack}`);
		});
		return message.channel.send("Okay, I have unrestricted all channels on this server.");
	} else {
		if(args[0] == "all") {
			let chanArr = message.guild.channels.keyArray();
			if(!args[1]) {
				bot.guildSettings[message.guild.id].ignoredChannels = chanArr;
				await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4, err => {
					if(err) throw err;
				}), err => {
					if(err) console.log(`Error writing to guildSettings:\n${err.stack}`);
				});
				return message.channel.send("Okay, I have restricted all channels on this server. To undo, simply type \`s!restrict reset\`");
			}
			if(!message.mentions.channels.first()) return message.reply(`Please mention a channel.`);
			let mentioned = message.mentions.channels.keyArray();
			for(let i = 0; i < mentioned.length; i++) {
				chanArr.splice(chanArr.indexOf(mentioned[i]), 1);
			}
			bot.guildSettings[message.guild.id].ignoredChannels = chanArr;
			await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4, err => {
				if(err) throw err;
			}), err => {
				if(err) console.log(`Error writing to guildSettings:\n${err.stack}`);
			});
			return message.channel.send(`Okay, all channels except the ones you have specified have been restricted!`);
		}
		if(!message.mentions.channels.first()) return message.reply(`Please mention a channel.`);
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
