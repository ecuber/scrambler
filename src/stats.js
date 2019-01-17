module.exports.run = async (bot, message, args, cube) => {
	if(!args[0]) return message.channel.send(`**Humans:**  ${bot.users.filter((usr) => !usr.bot).size}\n**Total Users:**  ${bot.users.size}\n**Total Servers:**  ${bot.guilds.size}`);
	if(args[0].startsWith("user")) return message.channel.send(`**Humans:**  ${bot.users.filter((usr) => !usr.bot).size}\n**Total:**  ${bot.users.size}`);
	if(args[0].startsWith("human")) return message.channel.send(`**Humans**:  ${bot.users.filter((usr) => !usr.bot).size}`);
	if(args[0].startsWith("server") || args[0].startsWith("guild")) return message.channel.send(`**Guilds:**  ${bot.guilds.size}`);
	return message.channel.send(`**Humans:**  ${bot.users.filter((usr) => !usr.bot).size}\n**Total Users:**  ${bot.users.size}\n**Total Servers:**  ${bot.guilds.size}`);
};
module.exports.config = { name: "stats", aliases: ["botstats"] };
