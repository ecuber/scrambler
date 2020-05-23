const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "7x7",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["seven-by-seven", "7x7x7"],
            usage: "[Count:number]",
            description: "Generates 1-5 7x7 scrambles."
        });
    }

    async run(message, [...params]) {
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 5 ? 5 : scrambles < 0 ? undefined : scrambles : undefined;
        let msgArr = cube("777", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n\n`;
        return message.send(scrambleStr);
    }
};
