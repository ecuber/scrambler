module.exports.run = async (bot, message, args, cube) => message.channel.send(cube.type("skewb").get());

module.exports.config = { name: "skewb", aliases: [] };
