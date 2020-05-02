const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "mega",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["megaminx"],
            usage: "[Count:number]",
            description: "Generates 1-5 Megaminx scrambles."
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 5 ? 5 : scrambles < 0 ? 1 : scrambles : 1;
        // console.log(cube);
        let msgArr = [];
        let scramble;
        scrambles = scrambles ? scrambles > 6 ? 6 : scrambles < 0 ? 1 : scrambles : 1;

        for (let x = 0; x < scrambles; x++) {
            scramble = [];
            for (let i = 1; i < 78; i++) {
                if (i !== 1 && i % 11 === 0) {
                    scramble[i - 2][2] === "-" ? scramble.push("U\'\n") : scramble.push("U\n");
                } else if (i === 1 || scramble[i - 2][0] === "D" || scramble[i - 2][0] === "U") {
                    scramble.push(`R${Math.random() < 0.5 ? "++" : "--"}`);
                } else {
                    scramble.push(`D${Math.random() < 0.5 ? "++" : "--"}`);
                }
            }
            msgArr.push(`\`\`\`\n${scramble.join(" ").replace(/U\n R/g, "U\nR").replace(/U'\n R/g, "U\'\nR")}\n\`\`\``);
        }
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n`;
        return message.send(scrambleStr);
    }
};
