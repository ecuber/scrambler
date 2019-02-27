const Scrambo = require("scrambo");
const cube = new Scrambo();
module.exports = {
	/*
    start scramble function shits
    */

	twox: function () {
		return cube.type("222").length(10).get();
	},

	threex: function () {
		return cube.type("333").length(20).get();
	},

	fourx: function () {
		let msgArr = [];
		let wides = ["Rw", "Uw", "Fw"];
		let nonWides = ["R", "U", "L", "D", "F", "B"];
		let scramble = [];
		let i = 0;
		while(scramble.length < 40) {
			let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
			if(i > 0 && (scramble[i - 1] === move)) {
				continue;
			} else {
				scramble.push(move);
				i++;
			}
		}
		msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
		return msgArr.join(" ");
	},

	fivex: function () {
		let msgArr = [];
		let wides = ["Rw", "Uw", "Lw", "Dw", "Fw", "Bw"];
		let nonWides = ["R", "U", "L", "D", "F", "B"];
		let scramble = [];
		let i = 0;
		while(scramble.length < 60) {
			let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
			if(i > 0 && (scramble[i - 1] === move)) {
				continue;
			} else {
				scramble.push(move);
				i++;
			}
		}
		msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
		return msgArr.join(" ");
	},

	sixx: function () {
		let msgArr = [];
		let wides = ["Rw", "Uw", "Fw", "Lw", "Dw", "Bw", "3Rw", "3Uw", "3Fw"];
		let nonWides = ["R", "U", "L", "D", "F", "B"];
		let scramble = [];
		let i = 0;
		while(scramble.length < 80) {
			let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
			if(i > 0 && (scramble[i - 1] === move)) {
				continue;
			} else {
				scramble.push(move);
				i++;
			}
		}
		msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
		return msgArr.join(" ");
	},

	sevenx: function () {
		let msgArr = [];
		let wides = ["Rw", "Uw", "Lw", "Dw", "Fw", "Bw", "3Rw", "3Uw", "3Lw", "3Dw", "3Fw", "3Bw"];
		let nonWides = ["R", "U", "L", "D", "F", "B"];
		let scramble = [];
		let i = 0;
		while(scramble.length < 100) {
			let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
			if(i > 0 && (scramble[i - 1] === move)) {
				continue;
			} else {
				scramble.push(move);
				i++;
			}
		}
		msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
		return msgArr.join(" ");
	},

	clockx: function () {
		let arr1 = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "All"];
		let arr2 = ["U", "R", "D", "L", "All"];
		let arr3 = ["UL", "UR", "DL", "DR"];
		let pm = ["+", "-"];
		let msgArr = [];
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
		return msgArr.join(" ");
	},

	megax: function () {
		let msgArr = [];
		for(var i = 1, scramble = []; i < 78; i++) {
			if(i !== 1 && i % 11 === 0) {
				scramble[i - 2][2] === "-" ? scramble.push("U\'\n") : scramble.push("U\n");
			} else if(i === 1 || scramble[i - 2][0] === "D" || scramble[i - 2][0] === "U") {
				scramble.push(`R${Math.random() < 0.5 ? "++" : "--"}`);
			} else {
				scramble.push(`D${Math.random() < 0.5 ? "++" : "--"}`);
			}
		}
		msgArr.push(`${scramble.join(" ").replace(/U\n R/g, "U\nR").replace(/U'\n R/g, "U\'\nR")}\n`);
		return msgArr.join(" ");
	},

	pyrax: function () {
		return cube.type("pyram").get();
	},

	skewbx: function () {
		return cube.type("skewb").get();
	},

	squanx: function () {
		return cube.type("sq1").get();
	},

	twox3: function () {
		let slices = ["R2", "R2", "R2", "R2", "F2"];
		let ud = ["U", "U\'", "U", "U\'", "U2", "D", "D\'", "D", "D\'", "D2"];
		let scramble = [];
		for(let i = 0; i < Math.round(Math.random() * (11 - 7) + 7); i++) {
			if(i % 2 == 0) {
				scramble.push(slices[Math.floor(Math.random() * slices.length)]);
			} else {
				scramble.push(ud[Math.floor(Math.random() * ud.length)]);
			}
		}
		return scramble.join(" ");
	}

	/*
    end scramble function shits
    */
};
