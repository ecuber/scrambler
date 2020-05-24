const { Command } = require("klasa");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "2-7",
            runIn: ["text"],
            cooldown: 3,
            aliases: [],
            usage: "",
            usageDelim: " ",
            description: "Generates one scramble for each of 2x2-7x7",
            extendedHelp: "https://docs.scramblr.app/docs/scramblers/puzzles"
        });
    }

    async run(message, [...params]) {
        await message.send("Loading scrambles, please wait.");
        let types = ["222", "333", "444", "555", "666", "777"];
        let scrambles = await types.map(type => cube(type)[0]);
        let scrambleStr = "";
        for (let i = 0; i < scrambles.length; i++)
            scrambleStr += `**${i + 2}x${i + 2}**: ${scrambles[i]}\n\n`;
        return message.send(scrambleStr);
    }
};
