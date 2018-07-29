const Discord = require("discord.js");

module.exports.run = async (bot, message, args, cube) => {
	message.channel.send("**New Updates:** 4x4 and 5x5 are now functional and have proper wide move notation! Also, custom server prefixes are now available! Use !prefix to learn more. The !help command is fancier now! Updates command was also added :wink:");
	message.channel.send("**Planned Updates:** 4x4 and 5x5 are using an inefficient method, to be updated with RegExp for faster response time. 6x6, 7x7, and some non WCA puzzles will follow in the coming months!");
};
module.exports.config = { name: "updates", aliases: ["whatsnew"] };
