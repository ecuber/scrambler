module.exports.run = async (bot, message, args, cube) => message.channel.send("**New Updates:**\n\n***Non-WCA Update***\n• Redi cube scrambles added! Random-state scrambles from xyzzy. Try `s!redi` to give it a shot like any other scramble command. More non-WCA scrambles will follow over the next couple weeks.\n**Planned Updates:**\n• WCA-equivalent and random state scrambles coming to scrambler shortly..");

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
