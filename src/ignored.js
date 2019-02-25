const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let settings = bot.guildSettings;
	let guild = settings[message.guild.id];
	if(!guild.ignoredChannels[0]) return message.channel.send("You have no ignored channels on this server.");
	let chanArr = guild.ignoredChannels;
	let nameArr = [];
	for(let i = 0; i < chanArr.length; i++) {
		if(bot.channels.get(chanArr[i]).type != "text") continue;
		nameArr.push(bot.channels.get(chanArr[i]).name);
	}
	let embed = new Discord.RichEmbed()
		.setTitle("Restricted Channels")
		.setColor("RANDOM")
		.setDescription(`• ${nameArr.join("\n• ")}`)
		.setTimestamp()
		.setFooter(`${bot.user.username}`, bot.user.displayAvatarURL);
	await message.channel.send(embed);
};
module.exports.config = { name: "ignored", aliases: ["restricted"] };
