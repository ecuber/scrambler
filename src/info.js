const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args, cube) => {
	function formatMili(miliseconds) {
		let days, hours, minutes, total_hours, total_minutes, total_seconds;

		total_seconds = parseInt(Math.floor(miliseconds / 1000));
		total_minutes = parseInt(Math.floor(total_seconds / 60));
		total_hours = parseInt(Math.floor(total_minutes / 60));
		days = parseInt(Math.floor(total_hours / 24));
		minutes = parseInt(total_minutes % 60);
		hours = parseInt(total_hours % 24);
		return `${days} days, ${hours} hours, ${minutes} minutes`;
	}

	let embed = new Discord.RichEmbed()
		.setAuthor(bot.user.username, bot.user.displayAvatarURL)
		.setColor("RANDOM")
		.addField("Language", "Node.js", true)
		.addField("Library", "Discord.js", true)
		.addField("Ping", `${Math.floor(bot.ping)}ms`, true)
		.addField("Invite Bot", "[Invite Here!](https://discordapp.com/api/oauth2/authorize?client_id=423530119836073986&permissions=67111936&scope=bot)", true)
		.addField("Support Server", "[Join Here!](https://discord.gg/bzKHzXc)", true)
		.addField("GitHub Repository", "[Check it out!](https://github.com/ecuber/scrambler)", true)
		.addField("Documentation", "[Click here to read the docs!](https://scrambler.gitbook.io/docs/)")
		.addField("Guilds", bot.guilds.size, true)
		.addField("Human Users", bot.users.filter((usr) => !usr.bot).size, true)
		.addField("Uptime", `${formatMili(bot.uptime)}`, true)
		.addField("Creators", "**ecuber#0566** and **Bacon#1153**")
		.addField("Created", bot.user.createdAt)
		.addField("Description", "Scrambler is a Discord bot that generates scrambles for common twisty puzzles. Concept originated from ecuber#0566, this version of bot has been coded mostly by Bacon#1153, revised with new features by ecuber.")
		.setTimestamp()
		.setFooter(`Scrambler`, bot.user.displayAvatarURL);

	return message.channel.send({ embed: embed });
};
module.exports.config = { name: "info", aliases: ["description", "information"] };
