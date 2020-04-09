const { Command } = require('klasa');
const cube = require("scrambo");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: '3x3',
            runIn: ['text'],
            cooldown: 3,
            aliases: ["three-by-three", "3x3x3"],
            description: "Generates 1-12 3x3 scrambles."
        });
    }

    async run(message, [...params]) {
        let scrambles = parseInt(params[0]);
        scrambles = scrambles ? scrambles > 12 ? 12 : scrambles < 0 ? undefined : scrambles : undefined;
        let scramble = cube.type("333").length(20).get(scrambles);
        return message.send(scramble.join("\n\n"));
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};