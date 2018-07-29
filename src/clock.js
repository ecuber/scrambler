module.exports.run = async (bot, message, args, cube) => {
	let arr1 = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "All"];
	let arr2 = ["U", "R", "D", "L", "All"];
	let arr3 = ["UL", "UR", "DL", "DR"];
	let pm = ["+", "-"];
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
	return message.channel.send(scramble.join(" "));
};

module.exports.config = { name: "clock", aliases: [] };
