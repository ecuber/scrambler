const Discord = require("discord.js");

module.exports.run = async (bot, message, args, cube) => {
	let embed = new Discord.RichEmbed()
		.setTitle("Sorry for the inconvenience...")
		.setColor("RANDOM")
		// .setDescription("This update has everything you need to host competitions on your server!")
		.addField("Why are things broken?", "Scrambler's server went through an unforseen issue, so all new commands that store data will not work for the time being. Apologies for the inconvenience. Join the support server with `s!invite` for updates on when these features will return.")
		// .addField("Competition Scrambles", "Long gone are the days of copying and pasting each scramble into the Discord server! Now, configure your competition scrambles easily with \`s!config\` and get all the scrambles at once with \`s!comp\`. These commands are mod-only, and are sure to save you a LOT of time.")
		// .addField("Competition Results", "Gone too are the days of manual result compilation! Have your members submit times with \`s!submit <event> <average result>\`, and when you're ready do \`s!podiums\` to have the top 3 from every event posted.")
		// .addField("MongoDB!", "Scrambler is now completely switched to a proper MongoDB database instead of a flimsy JSON file. Your server's data will be more secure, more organized, and reached more quickly on the server.")
		.setFooter(`${bot.user.username}`, bot.user.displayAvatarURL)
		.setTimestamp();

	message.channel.send(embed);
};

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
