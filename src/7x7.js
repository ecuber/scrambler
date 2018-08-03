module.exports.run = async (bot, message, args) => {
	let possibleMoves = ["R", "U", "L", "D", "F", "B", "Rw", "Uw", "Lw", "Dw", "Fw", "Bw", "3Rw", "3Uw", "3Lw", "3Dw", "3Fw", "3Bw"];
	let opposites = {
		"3Uw": "3Dw",
		"3Rw": "3Lw",
		"3Fw": "3Bw",
		"3Dw": "3Uw",
		"3Lw": "3Rw",
		"3Bw": "3Fw"
	};
	let scramble = [];
	let i = 0;
	while(scramble.length < 100) {
		let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
		if(i > 0 && (scramble[i - 1] === move || (Object.keys(opposites).includes(move) && opposites[move] === scramble[i - 1]))) {
			continue;
		} else {
			scramble.push(move);
			i++;
		}
	}
	scramble = scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'");
	return message.channel.send(scramble.join(" "));
};

module.exports.config = { name: "7x7", aliases: ["7x7x7"] };
