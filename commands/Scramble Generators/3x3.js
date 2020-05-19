const { Command } = require("klasa");
const cube = require("scrambler-util");
const { orient } = require("../../util/orient.js");

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
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        let msgArr = cube("333", scrambles);
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++) {
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${fmc ? "R\' U\' F " : ""}${msgArr[i]} ${fmc ? "R\' U\' F " : ""}${bld ? orient("333") : ""}\n\n`;
        }
        return message.send(scrambleStr);
    }
};
