module.exports.run = async (bot, message, args, cube) => {
	let scrambles = parseInt(args[0]);
	scrambles = scrambles ? scrambles > 10 ? 10 : scrambles < 0 ? undefined : scrambles : undefined;
	let scramble = cube.type("sq1").get(scrambles);
	return message.channel.send(scramble.join("\n\n"));
};

module.exports.config = { name: "square-one", aliases: ["sq1", "squareone", "square1", "square_one", "square1"] };
