const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: '7x7',
            runIn: ['text'],
            cooldown: 5,
            aliases: ["seven-by-seven", "7x7x7"],
            usage: "[Count:number]", 
            description: "Generates 1-5 7x7 scrambles."
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 5 ? 5 : scrambles < 0 ? undefined : scrambles : undefined;
        // console.log(cube);
        let msgArr = [];
    	for(let x = 0; x < scrambles; x++) {
            let wides = ["Rw", "Uw", "Lw", "Dw", "Fw", "Bw", "3Rw", "3Uw", "3Lw", "3Dw", "3Fw", "3Bw"];
            let nonWides = ["R", "U", "L", "D", "F", "B"];
            let scramble = [];
            let i = 0;
            while(scramble.length < 100) {
                let move = Math.random() > 0.3 ? nonWides[Math.floor(Math.random() * nonWides.length)] : wides[Math.floor(Math.random() * wides.length)];
                if(i > 0 && (scramble[i - 1] === move)) {
                    continue;
                } else {
                    scramble.push(move);
                    i++;
                }
            }
            msgArr.push(scramble.map(index => Math.random() < 0.5 ? index += "2" : index += "\'").join(" "));
        }
        let scrambleStr = "";
        for (let i = 0; i < msgArr.length; i++)
            scrambleStr += `${scrambles > 1 ? `${i + 1}: ` : ``}${msgArr[i]}\n\n`;
        return message.send(scrambleStr);
    }


};