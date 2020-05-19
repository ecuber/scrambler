const { Command } = require("klasa");
const cube = require("scrambler-util");
const { orient } = require("../../util/orient.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "2x2",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["two-by-two", "2x2x2"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 2x2 or 2BLD scrambles.",
            extendedHelp: "2x2 BLD is also available. (e.g. For 5 2x2 BLD scrambles, do s!2x2 bld 5)"
        });
    }

    async run(message, [...params]) {
        let bld = params[0] === "bld";
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        let scramble = cube("222", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < scramble.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${scramble[i]} ${bld ? orient("222") : ""}\n\n`;
        return message.send(scrambleStr);
    }
};
