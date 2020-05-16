const { Command } = require("klasa");
const Scrambo = require("scrambo");
const cube = new Scrambo();
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
        // console.log(params);
        let bld = params[0] === "bld";
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;

        let scramble = cube.type("222").length(Math.floor(Math.random() * 3) + 10).get(scrambles);
        let scrambleStr = "";

        // console.log(`bruh ${orient("222")}`);
        for (let i = 0; i < scramble.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${scramble[i]} ${bld ? orient("222") : ""}\n\n`;
        return message.send(scrambleStr);
    }
};
