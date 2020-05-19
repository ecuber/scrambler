const { Command } = require("klasa");
const { orient } = require("../../util/orient.js");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "4x4",
            runIn: ["text"],
            cooldown: 3,
            aliases: ["four-by-four", "4x4x4"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 4x4 or 4BLD scrambles.",
            extendedHelp: "e.g. For 5 4BLD scrambles, do s!4x4 bld 5"
        });
    }

    async run(message, [...params]) {
        let bld = params[0] === "bld";
        let scrambles = parseInt(params[1]);
        let scrambleStr = "";
        scrambles = scrambles ? scrambles > 5 ? 5 : scrambles < 0 ? 1 : scrambles : 1;
        await message.send("Loading scrambles...").then(m => {
            let msgArr = cube("444", scrambles);
            for (let i = 0; i < msgArr.length; i++)
                scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]} ${bld ? orient("444") : ""}\n\n`;
        });

        return message.send(scrambleStr);
    }
};
