const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            guarded: true,
            description: language => language.get("COMMAND_INVITE_DESCRIPTION")
        });
    }

    async run(message) {
        return message.send("Click here to add the bot to your own server! :arrow_right: https://discordapp.com/api/oauth2/authorize?client_id=423530119836073986&permissions=52288&scope=bot");
    }

    async init() {
        if (this.client.application && !this.client.application.botPublic) this.permissionLevel = 10;
    }
};
