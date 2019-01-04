module.exports.run = async (bot, message, args, cube) => {
	let scrambles = parseInt(args[0]);
	scrambles = scrambles ? scrambles > 10 ? 10 : scrambles < 0 ? undefined : scrambles : undefined;
	let scramble = cube.type("pyram").get(scrambles);
	return message.channel.send(scramble.join("\n\n"));
};
module.exports.config = { name: "pyraminx", aliases: ["pyra", "pyramid"] };
