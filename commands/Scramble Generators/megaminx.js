const { Command } = require("klasa");
const cube = require("scrambler-util");

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
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 5 ? 5 : scrambles < 0 ? 1 : scrambles : 1;
        let msgArr = cube("mega", scrambles);

        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n`;
        return message.send(scrambleStr);
    }
};
