module.exports.run = async (bot, message, args, cube) => message.channel.send("**New Updates:**\n• The \`s!restrict\` command has been added! This will cause the bot to ignore messages sent in the specified channel. Do \`s!restrict help\` for more information.\n• 6x6 now has the proper wide moves and ratios.\n**Planned Updates:**\n• Some non-WCA event scrambles are coming soon. Suggest some that you\'d like to be added. \n• WCA equivalent scrambles coming soon to currently available commands.");

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
