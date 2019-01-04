const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	let embed = new Discord.RichEmbed()
		.setAuthor(bot.user.username, bot.user.displayAvatarURL)
		.setColor("RANDOM")
		.addField("Language", "Node.js", true)
		.addField("Library", "Discord.js", true)
		.addField("Ping", `${Math.floor(bot.ping)}ms`, true)
		.addField("Invite", "[Invite Here!](https://discordapp.com/api/oauth2/authorize?client_id=423530119836073986&permissions=67111936&scope=bot)", true)
		.addField("Support Server", "[Join Here!](https://discord.gg/bzKHzXc)", true)
		.addField("Speedsolving Thread", "[Check it out!](https://www.speedsolving.com/forum/threads/discord-scrambler-bot.69248/)", true)
		.addField("Guilds", bot.guilds.size, true)
		.addField("Users", bot.users.size, true)
		.addField("Creators", "**ecuber#0566** and **Bacon#1153**")
		.addField("Created", bot.user.createdAt)
		.addField("Description", "Scrambler is a Discord bot that generates scrambles for common twisty puzzles. Concept originated from ecuber#0566, this version of bot has been coded mostly by Bacon#1153, revised and with new features from ecuber.")
		.setTimestamp()
		.setFooter(`Scrambler`, bot.user.displayAvatarURL);

	return message.channel.send({ embed: embed });
};
module.exports.config = { name: "info", aliases: ["stats", "invite"] };
