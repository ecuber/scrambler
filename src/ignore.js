const Discord = require("discord.js");
const fs = require("fs");
module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(args[0] == "help" || !args[0]) {
		return message.channel.send(new Discord.RichEmbed()
			.setTitle("s!ignore")
			.setColor("RANDOM")
			.setDescription("\nUsage: `s!ignore <#channel | reset | all <#optional #exempted #channels> >`\n(Mention the channel you'd like to ignore, without the <>.)")
			.addField("Toggle Ignore in 1 Channel", "`s!ignore #general`: Scrambler commands will not work in #general if it is already unrestricted. If it is restricted, Scrambler commands *will* work in #general.")
			.addField("Toggling Multiple Channels", "`s!ignore #general #media`: Scrambler will toggle ignoring in the channels mentioned.")
			.addField("Ignoring all channels", "`s!ignore all`: Scrambler will not respond to commands (except s!ignore) in any channel. **Not Recommended**")
			.addField("Ignoring all channels except ones specified", "`s!ignore all #commands #race`: Scrambler commands will not work in any channel except for #commands and #race **RECOMMENDED**")
			.addField("Resetting Restrictions", "`s!ignore reset`: Scrambler commands will work in all channels.")
			.addField("Documentation", "https://scrambler.gitbook.io/docs/util/ignore"));
	}
	let guild = await bot.guildData.findOne({ guildID: message.guild.id }, { _id: 0, upsert: true });
	if(args[0] == "reset") {
		bot.guildData.updateOne({ guildID: message.guild.id }, { $unset: { restricted: [] } });
		return message.channel.send("Okay, I have unrestricted all channels on this server.");
	} else {
		// All channels
		if(args[0] == "all") {
			// If no arguments are passed (channel mentions) it will send all channels to the ignored array.
			let chanArr = message.guild.channels.keyArray();
			if(!args[1]) {
				bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { restricted: chanArr } });
				return message.channel.send("Okay, I have restricted all channels on this server. To undo, simply type \`s!restrict reset\`");
			}
			// If there *is* an argument, but no mentioned channel
			if(!message.mentions.channels.first()) return message.reply(`Please mention a channel.`);
			// Argument passed, and it is a mention
			let mentioned = message.mentions.channels.keyArray();
			// Loop through ID array to remove any mentioned channels
			for(let i = 0; i < mentioned.length; i++) {
				chanArr.splice(chanArr.indexOf(mentioned[i]), 1);
			}
			await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { restricted: chanArr } });
			return message.channel.send(`Okay, all channels except the ones you have specified will now be ignored!`);
		}
		// All further command variants require a channel mention
		if(!message.mentions.channels.first()) return message.reply(`Please mention a channel.`);
		let chanArr;
		if(guild.restricted) {
			chanArr = guild.restricted;
		} else {
			chanArr = [];
		}
		let guildID = message.guild.id;
		let channelIDs = message.mentions.channels.keyArray();
		let ignored = [];
		let unignored = [];
		channelIDs.forEach(channelID => {
			if(guild.restricted && guild.restricted.includes(channelID)) {
				let indexChannel = chanArr.indexOf(channelID);
				chanArr.splice(indexChannel, 1);
				unignored.push(channelID);
			} else {
				chanArr.push(channelID);
				ignored.push(channelID);
			}
		});
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { restricted: chanArr } });
		// Reporting changes via Message
		if(ignored.length && unignored.length) return message.channel.send(`Okay, I will now ignore Scrambler commands in ${ignored.length} channel(s) and will resume working in ${unignored.length} channel(s).`);
		if(ignored.length && !unignored.length) {
			if(ignored.length > 1) return message.channel.send(`Okay, I will now ignore commands in ${ignored.length} new channels!`);
			return message.channel.send(`Okay, I will now ignore all Scrambler commands in ${bot.channels.get(ignored[0])}`);
		}
		if(!ignored.length && unignored.length) {
			if(unignored.length > 1) return message.channel.send(`Okay, I will no longer ignore commands in ${unignored.length} channels!`);
			return message.channel.send(`Okay, I will no longer ignore Scrambler commands in ${bot.channels.get(unignored[0])}`);
		}
	}
};

module.exports.config = { name: "ignore", aliases: ["restrict"] };
