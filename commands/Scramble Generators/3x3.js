const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "3x3",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["three-by-three", "3x3x3"],
            usage: "[bld|fmc] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 3x3, 3x3 BLD, or 3x3 FMC scrambles.",
            extendedHelp: "e.g. For 5 FMC scrambles, do s!3x3 fmc 5"
        });
    }


    async run(message, [...params]) {
        let bld = params[0] === "bld";
        let fmc = params[0] === "fmc";
        let count = parseInt(params[1]);
        count = count ? count > 12 ? 12 : count < 0 ? undefined : count : undefined;
        let scrambles = cube("333", count, bld ? "bld" : fmc ? "fmc" : null);
        let scrambleStr = "";
        for (let i = 0; i < scrambles.length; i++) {
            scrambleStr += `${count > 1 ? `${i + 1}: ` : ``}${scrambles[i]}\n\n`;
        }
        return message.send(scrambleStr);
    }
};
