module.exports.run = async (bot, message, args, cube) => {
	let msgArr = [];
	let scrambles = parseInt(args[0]);
	scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? 1 : scrambles : 1;
	let slices = ["R2", "R2", "R2", "R2", "F2"];
	let ud = ["U", "U\'", "U", "U\'", "U2", "D", "D\'", "D", "D\'", "D2"];
	for(let x = 0; x < scrambles; x++) {
		let scramble = [];
		for(let i = 0; i < Math.round(Math.random() * (11 - 7) + 7); i++) {
			if(i % 2 == 0) {
				scramble.push(slices[Math.floor(Math.random() * slices.length)]);
			} else {
				scramble.push(ud[Math.floor(Math.random() * ud.length)]);
			}
		}
		msgArr.push(scramble.join(" "));
	}
	message.channel.send(msgArr.join("\n\n"));
};
module.exports.config = { name: "2x2x3", aliases: ["tower", "towercube", "2x3"] };
