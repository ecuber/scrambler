const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "skewb",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["skoob", "ivy", "ivy-cube"],
            usage: "[Count:number]",
            description: "Generates 1-12 skewb/ivy cube scrambles.",
            extendedHelp: "https://docs.scramblr.app/docs/scramblers/args"
        });
    }

    async run(message, [...params]) {
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        let msgArr = cube("skewb", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]} \n\n`;
        return message.send(scrambleStr);
    }
};
