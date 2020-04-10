const { Command } = require('klasa');
const Scrambo = require("scrambo");
const cube = new Scrambo();

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: '3x3',
            runIn: ['text'],
            cooldown: 3,
            aliases: ["three-by-three", "3x3x3"],
            usage: "[Count:number]", 
            description: "Generates 1-12 3x3 scrambles.",
            category: "Scramble Generators"
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        // console.log(cube);
        let scramble = cube.type("333").length(Math.floor(Math.random() * 3) + 18).get(scrambles);
        let scrambleStr = "";
        for (let i = 0; i < scramble.length; i++)
            scrambleStr += `${i + 1}: ${scramble[i]}\n\n`;
        return message.send(scrambleStr);
    }


};