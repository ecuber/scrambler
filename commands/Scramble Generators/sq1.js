const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "sq1",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["squan", "square-one", "square-1"],
            usage: "[Count:number]",
            description: "Generates 1-12 Square-1 scrambles.",
            extendedHelp: "https://docs.scramblr.app/docs/scramblers/args"
        });
    }

    async run(message, [...params]) {
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        let scramble = cube("sq1", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < scramble.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${scramble[i]} \n\n`;
        return message.send(scrambleStr);
    }
};
