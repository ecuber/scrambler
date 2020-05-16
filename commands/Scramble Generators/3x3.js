const { Command } = require("klasa");
const Scrambo = require("scrambo");
const cube = new Scrambo();
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
        // console.log(params);
        let bld = params[0] === "bld";
        let fmc = params[0] === "fmc";
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        // console.log(cube);
        let scramble = cube.type("333").length(Math.floor(Math.random() * 2) + 19).get(scrambles);
        let scrambleStr = "";

        for (let i = 0; i < scramble.length; i++) {
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${fmc ? "R\' U\' F " : ""}${scramble[i]} ${fmc ? "R\' U\' F " : ""}${bld ? orient("333") : ""}\n\n`;
        }
        return message.send(scrambleStr);
    }
};
