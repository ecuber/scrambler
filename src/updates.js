module.exports.run = async (bot, message, args, cube) => message.channel.send("***Check Restricted Channels***\n• Easily see which channels you've restricted with the new \`s!restricted\` command.\n\n***Planned Updates:***\n• Transitioning all data to MongoDB system is hopefully going to be done soon, some limitations with the Raspberry Pi's operating system are slowing the process down.`");

module.exports.config = { name: "updates", aliases: ["update", "whatsnew"] };
