module.exports.run = async (bot, message, args, cube) => {
	let scrambles = parseInt(args[0]);
	scrambles = scrambles ? scrambles > 10 ? 10 : scrambles < 0 ? undefined : scrambles : undefined;
	let scramble = cube.type("333").length(20).get(scrambles);
	return message.channel.send(`${scramble.join("\n\n")}\n₉ₒₒₔ ₑᵥₑₙₜ.`);
};
module.exports.config = { name: "oh", aliases: ["onehanded", "one-handed", "onehand", "one-hand"] };
