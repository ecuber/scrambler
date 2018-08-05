module.exports.run = async (bot, message, args, cube) => message.channel.send("**New Updates:**\n• All of the scramble commands now feature MultiScrambleTechnology™. Try it out by going \`s!<cube> <# of scrambles for that cube>\`!\n• The megaminx command has gotten a complete makeover and will now do scrambles properly.\n• 4x4 - 7x7 commands now have the proper ratio of wide to non-wide moves.\n**Planned Updates:**\n• Some non-WCA event scrambles are coming soon. Suggest some that you\'d like to be added.");

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
