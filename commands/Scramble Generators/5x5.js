const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "5x5",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["five-by-five", "5x5x5", "5"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-8 5x5 or 5BLD scrambles.",
            extendedHelp: "e.g. For 5 5BLD scrambles, do s!5x5 bld 5"
        });
    }

    async run(message, [...params]) {
        let count = parseInt(params[1]);
        count = count ? count > 8 ? 8 : count < 0 ? 1 : count : 1;
        let scrambles = await cube("555", count, params[0] === "bld" ? "bld" : null);
        let scrambleStr = "";
        for (let i = 0; i < scrambles.length; i++)
            scrambleStr += `${count > 1 ? `${i + 1}: ` : ``}${scrambles[i]}\n\n`;
        return message.send(scrambleStr);
    }
};
