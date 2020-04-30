const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'tower',
            runIn: ['text'],
            cooldown: 3,
            aliases: ["2x2x3", "tower-cube"],
            usage: "[Count:number]", 
            description: "Generates 1-12 2x2x3 scrambles."
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? 1 : scrambles : 1;

        let msgArr = [];
    	for(let x = 0; x < scrambles; x++) {
            let scramble = [];
            for(let i = 0; i < Math.round(Math.random() * 2 + 8); i++) {
                if (i % 2 == 0) {
                    scramble.push(Math.random() < 0.65 ? "R2" : "F2")
                } else {
                    scramble.push(`${Math.random() < 0.5 ? "U" : "D"}${Math.random() < 0.5 ? "\'" : ""}`)
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