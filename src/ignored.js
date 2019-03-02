const Discord = require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let settings = bot.guildSettings;
	let guild = await bot.guildData.findOne({ guildID: message.guild.id }, { _id: 0 });
	if(!guild || !guild.restricted) return message.channel.send("You have no ignored channels on this server.");
	let chanArr = guild.restricted;
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
		.setFooter(`To unignore any of these channels, run \"s!ignore #channel\"`, bot.user.displayAvatarURL);
	await message.channel.send(embed);
};
module.exports.config = { name: "ignored", aliases: ["restricted"] };
