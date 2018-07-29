module.exports.run = async (bot, message, args, cube) => message.channel.send(`pOng! \`${Math.floor(bot.ping)} ms\``);

module.exports.config = { name: "ping", aliases: [] };
