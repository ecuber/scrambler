const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "4x4",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["four-by-four", "4x4x4"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 4x4 or 4BLD scrambles.",
            extendedHelp: "e.g. For 5 4BLD scrambles, do s!4x4 bld 5"
        });
    }

    async run(message, [...params]) {
        let bld = params[0] === "bld";
        let count = parseInt(params[1]);
        let scrambleStr = "";
        count = count ? count > 5 ? 5 : count < 0 ? 1 : count : 1;
        await message.send("Loading scrambles...").then(m => {
            let scrambles = cube("444", count, bld ? "bld" : null);
            for (let i = 0; i < scrambles.length; i++)
                scrambleStr += `${count > 1 ? `${i + 1}: ` : ``}${scrambles[i]}\n\n`;
        });

        return message.send(scrambleStr);
    }
};
