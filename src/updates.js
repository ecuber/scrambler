const Discord = require("discord.js");

module.exports.run = async (bot, message, args, cube) => {
	let embed = new Discord.RichEmbed()
		.setTitle("THE COMPETITION UPDATE")
		.setColor("RANDOM")
		.setDescription("This update has everything you need to host competitions on your server!")
		.addField("Competition Scrambles", "Long gone are the days of copying and pasting each scramble into the Discord server! Now, configure your competition scrambles easily with \`s!config\` and get all the scrambles at once with \`s!comp\`. These commands are mod-only, and are sure to save you a LOT of time.")
		.addField("Competition Results", "Gone too are the days of manual result compilation! Have your members submit times with \`s!submit <event> <average result>\`, and when you're ready do \`s!podiums\` to have the top 3 from every event posted.")
		.addField("MongoDB!", "Scrambler is now completely switched to a proper MongoDB database instead of a flimsy JSON file. Your server's data will be more secure, more organized, and reached more quickly on the server.")
		.setFooter(`${bot.user.username}`, bot.user.displayAvatarURL)
		.setTimestamp();

	message.channel.send(embed);
};

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
