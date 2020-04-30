const { Command } = require('klasa');
const Scrambo = require("scrambo");
const cube = new Scrambo();

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'skewb',
            runIn: ['text'],
            cooldown: 3,
            aliases: ["skoob", "ivy", "ivy-cube"],
            usage: "[Count:number]",
            description: "Generates 1-12 skewb/ivy cube scrambles.",
            category: "Scramble Generators"
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;

        let scramble = cube.type("skewb").length(Math.floor(Math.random() * 2) + 11).get(scrambles);
        let scrambleStr = "";

        for (let i = 0; i < scramble.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${scramble[i]} \n\n`;
        return message.send(scrambleStr);
    }


};