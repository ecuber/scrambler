module.exports.run = async (bot, message, args) => {
	let msgArr = [];
	let scrambles = parseInt(args[0]);
	scrambles = scrambles ? scrambles > 4 ? 4 : scrambles < 0 ? 1 : scrambles : 1;
	for(let x = 0; x < scrambles; x++) {
		let wides = ["Rw", "Uw", "Lw", "Dw", "Fw", "Bw", "3Rw", "3Uw", "3Lw", "3Dw", "3Fw", "3Bw"];
		let nonWides = ["R", "U", "L", "D", "F", "B"];
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
			let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
			if(i > 0 && (scramble[i - 1] === move || (Object.keys(opposites).includes(move) && opposites[move] === scramble[i - 1]))) {
				continue;
			} else {
				scramble.push(move);
				i++;
			}
		}
		msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
	}
	return message.channel.send(msgArr.join("\n\n"));
};

module.exports.config = { name: "7x7", aliases: ["7x7x7"] };
