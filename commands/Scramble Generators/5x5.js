const { Command } = require("klasa");
const { orient } = require("../../util/orient.js");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "5x5",
            runIn: ["text"],
            cooldown: 5,
            aliases: ["five-by-five", "5x5x5"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-8 5x5 or 5BLD scrambles.",
            extendedHelp: "e.g. For 5 5BLD scrambles, do s!5x5 bld 5"
        });
    }

    async run(message, [...params]) {
        let bld = params[0] === "bld";
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 8 ? 8 : scrambles < 0 ? 1 : scrambles : 1;
        let msgArr = cube("555", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]} ${bld ? orient("555") : ""}\n\n`;
        return message.send(scrambleStr);
    }
};
