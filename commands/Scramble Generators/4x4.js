const { Command } = require("klasa");
const { orient } = require("../../util/orient.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "4x4",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["four-by-four", "4x4x4"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 4x4 or 4BLD scrambles.",
            extendedHelp: "e.g. For 5 4BLD scrambles, do s!4x4 bld 5"
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let bld = RegExp(/\bbld\b/gi).test(params[0]);
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? 1 : scrambles : 1;

        let msgArr = [];
        for (let x = 0; x < scrambles; x++) {
            let wides = ["Rw", "Uw", "Fw"];
            let nonWides = ["R", "U", "L", "D", "F", "B"];
            let scramble = [];
            let i = 0;
            while (scramble.length < 40) {
                let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
                if (i > 0 && (scramble[i - 1] === move)) {
                    continue;
                } else {
                    scramble.push(move);
                    i++;
                }
            }
            msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
        }
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]} ${bld ? orient("444") : ""}\n\n`;
        return message.send(scrambleStr);
    }
};
