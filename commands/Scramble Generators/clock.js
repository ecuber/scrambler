const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "clock",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["notacube"],
            usage: "[Count:number]",
            description: "Generates 1-12 Clock scrambles."
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 5 ? 5 : scrambles < 0 ? 1 : scrambles : 1;
        // console.log(cube);
        let msgArr = [];

        let arr1 = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "All"];
        let arr2 = ["U", "R", "D", "L", "All"];
        let arr3 = ["UL", "UR", "DL", "DR"];
        let pm = ["+", "-"];
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? 1 : scrambles : 1;

        for (let x = 0; x < scrambles; x++) {
            let scramble = [];
            for (let i = 0, len = arr1.length; i < len; i++) {
                let move = arr1[i];
                move += Math.floor(Math.random() * 6);
                move += pm[Math.round(Math.random())];
                scramble.push(move);
            }

            for (let i = 0, len = arr2.length; i < len; i++) {
                let move = arr2[i];
                if (i === 0) scramble.push("y2");
                move += Math.floor(Math.random() * 6);
                move += pm[Math.round(Math.random())];
                scramble.push(move);
            }

            for (let i = 0, len = arr3.length; i < len; i++) {
                let move = arr3[i];
                let det = Math.round(Math.random());
                if (det) scramble.push(move);
            }
            msgArr.push(scramble.join(" "));
        }
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n\n`;
        return message.send(scrambleStr);
    }
};
