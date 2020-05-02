const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'redi',
            runIn: ['text'],
            cooldown: 3,
            aliases: ["redi-cube"],
            usage: "[Count:number]", 
            description: "Generates 1-12 redi cube scrambles."
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? 1 : scrambles : 1;
        let msgArr = [];
        
    	for(let x = 0; x < scrambles; x++) {
            let moves = ["R", "L"];
            let scramble = [];
            let move;
            for (let i = 0; i < Math.floor(Math.random() * 2 + 6.5); i++) {
                scramble.push(i == 0 ? "" : "x");
                move = Math.floor(Math.random() * moves.length);
                for (let turns = 0; turns < Math.floor(Math.random() * 3 + 3); turns++) {
                    scramble.push(`${moves[move % 2]}${Math.random() < 0.5 ? "\'" : ""}`);
                    move++;
                }
            }
            msgArr.push(scramble.join(" "));
        }

        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n\n`;
        return message.send(scrambleStr);
    }

};