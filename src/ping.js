module.exports.run = async (bot, message, args, cube) => message.channel.send(`Pong! \`${Math.floor(bot.ping)} ms\``);
module.exports.config = { name: "ping", aliases: [] };
