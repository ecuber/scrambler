module.exports.run = async (bot, message, args, cube) => message.channel.send("**New Updates:**\n\n***Non-WCA Update***\n• Redi cube scrambles added! Random-state scrambles from xyzzy. Try `s!redi` to give it a shot like any other scramble command.\n•Huge Relay addition! Try `s!relay` to see what it's all about.\n**Planned Updates:**\n• Wayy more non-WCA puzzles to come to scrambler soon! Suggest some in the support server. This can be reached with `s!info`");

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
