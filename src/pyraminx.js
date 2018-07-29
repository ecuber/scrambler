module.exports.run = async (bot, message, args, cube) => message.channel.send(cube.type("pyram").get());

module.exports.config = { name: "pyraminx", aliases: ["pyra", "pyramid"] };
