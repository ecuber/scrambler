module.exports.run = async (bot, message, args, cube) => message.channel.send(cube.type("minx").length(77).get());

module.exports.config = { name: "megaminx", aliases: ["mega", "minx", "mm"] };
