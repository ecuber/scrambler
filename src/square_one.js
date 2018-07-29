module.exports.run = async (bot, message, args, cube) => message.channel.send(cube.type("sq1").get());

module.exports.config = { name: "square-one", aliases: ["sq1", "squareone", "square1", "square_one", "square1"] };
