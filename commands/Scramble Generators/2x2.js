const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "2x2",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["two-by-two", "2x2x2", "2"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 2x2 or 2BLD scrambles.",
            extendedHelp: "https://docs.scramblr.app/docs/scramblers/args"
        });
    }

    async run(message, [...params]) {
        let bld = params[0] === "bld";
        let count = parseInt(params[1]);
        count = count ? count > 12 ? 12 : count < 0 ? undefined : count : undefined;
        let scrambles = cube("222", count, bld ? "bld" : null);
        let scrambleStr = "";
        for (let i = 0; i < scrambles.length; i++)
            scrambleStr += `${count > 1 ? `${i + 1}: ` : ``}${scrambles[i]}\n\n`;
        return message.send(scrambleStr);
    }
};
