const { Command } = require('klasa');
const Scrambo = require("scrambo");
const cube = new Scrambo();
const orient = () => {
    let rotations = "";
    let moves = ["Rw", "Uw", "Fw"];
    for (let i = 0; i < (Math.floor(Math.random() * 2 + 1)); i++) {
        let index = Math.floor(Math.random() * moves.length);
        rotations += `${moves[index]}${Math.random > 0.5 ? "" : "\'"} `;
        moves.splice(index, 1);
    }
        return rotations;
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: '3x3',
            runIn: ['text'],
            cooldown: 3,
            aliases: ["three-by-three", "3x3x3"],
            usage: "[bld] [Count:number]",
            usageDelim: " ",
            description: "Generates 1-12 3x3 scrambles.",
            category: "Scramble Generators"
        });
    }


    async run(message, [...params]) {
        // console.log(params);
        let bld = RegExp(/\bbld\b/gi).test(params[0]);
        let scrambles = parseInt(params[1]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        // console.log(cube);
        let scramble = cube.type("333").length(Math.floor(Math.random() * 3) + 18).get(scrambles);
        let scrambleStr = "";

        for (let i = 0; i < scramble.length; i++) {
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${scramble[i]} ${bld ? orient() : ""}\n\n`;
        }
        return message.send(scrambleStr);
    }
    
};
