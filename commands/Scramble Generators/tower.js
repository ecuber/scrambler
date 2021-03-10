const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "tower",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["2x2x3", "tower-cube"],
            usage: "[Count:number]",
            description: "Generates 1-12 2x2x3 scrambles.",
            extendedHelp: "https://docs.scramblr.app/docs/scramblers/args"
        });
    }

    async run(message, [...params]) {
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? 1 : scrambles : 1;
        let msgArr = cube("223", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n\n`;
        return message.send(scrambleStr);
    }
};
