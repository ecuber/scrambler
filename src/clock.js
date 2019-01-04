module.exports.run = async (bot, message, args, cube) => {
	let arr1 = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "All"];
	let arr2 = ["U", "R", "D", "L", "All"];
	let arr3 = ["UL", "UR", "DL", "DR"];
	let pm = ["+", "-"];
	let msgArr = [];
	let scrambles = parseInt(args[0]);
	scrambles = scrambles ? scrambles > 10 ? 10 : scrambles < 0 ? 1 : scrambles : 1;

	for(let x = 0; x < scrambles; x++) {
		let scramble = [];
		for(let i = 0, len = arr1.length; i < len; i++) {
			let move = arr1[i];
			move += Math.floor(Math.random() * 6);
			move += pm[Math.round(Math.random())];
			scramble.push(move);
		}

		for(let i = 0, len = arr2.length; i < len; i++) {
			let move = arr2[i];
			if(i === 0) scramble.push("y2");
			move += Math.floor(Math.random() * 6);
			move += pm[Math.round(Math.random())];
			scramble.push(move);
		}

		for(let i = 0, len = arr3.length; i < len; i++) {
			let move = arr3[i];
			let det = Math.round(Math.random());
			if(det) scramble.push(move);
		}
		msgArr.push(scramble.join(" "));
	}
	return message.channel.send(msgArr.join("\n\n"));
};
module.exports.config = { name: "clock", aliases: ["watch"] };
