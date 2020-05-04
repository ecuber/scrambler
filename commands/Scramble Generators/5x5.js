const { Command } = require("klasa");
const orient = () => {
    let rotations = "";
    let moves = ["3Rw", "3Uw", "3Fw"];
    for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
        let index = Math.floor(Math.random() * moves.length);
        rotations += `${moves[index]}${Math.random > 0.5 ? "" : "\'"} `;
        moves.splice(index, 1);
    }
    return rotations;
};

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "5x5",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["five-by-five", "5x5x5"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-8 5x5 or 5BLD scrambles.",
            extendedHelp: "e.g. For 5 5BLD scrambles, do s!5x5 bld 5"
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let bld = RegExp(/\bbld\b/gi).test(params[0]);
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 8 ? 8 : scrambles < 0 ? 1 : scrambles : 1;

        let msgArr = [];
        for (let x = 0; x < scrambles; x++) {
            let wides = ["Rw", "Uw", "Lw", "Dw", "Fw", "Bw"];
            let nonWides = ["R", "U", "L", "D", "F", "B"];
            let scramble = [];
            let i = 0;
            while (scramble.length < 60) {
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
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]} ${bld ? orient() : ""}\n\n`;
        return message.send(scrambleStr);
    }
};
