module.exports.run = async (bot, message, args, cube, MongoClient) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	if(!args[0] || args[0] == "help") return message.channel.send("Usage: `s!prefix <desired prefix OR reset>`.\nExample: to set prefix to \`?\`, do \`s!prefix ?\`. To reset afterwards, do \`s!prefix reset\`");
	let guild = await bot.guildData.findOne({ guildID: message.guild.id }, { _id: 0, upsert: true }, err => console.log(err));
	if(args[0] == "reset") {
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $unset: { prefix: "" } });
		return message.channel.send(`Okay, I have reset your prefix to \`${bot.settings.prefix}\``);
	} else {
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { prefix: args[0] } }, { upsert: true });
		return message.channel.send(`I have set your prefix to \`${args[0]}\` To reset your prefix, do \`${args[0]}prefix reset\``);
	}
};
module.exports.config = { name: "prefix", aliases: [] };
