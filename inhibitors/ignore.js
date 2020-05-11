const { Inhibitor } = require("klasa");

module.exports = class extends Inhibitor {
    constructor(...args) {
        super(...args, {
            name: "ignore",
            enabled: true,
            spamProtection: false
        });
    }

    async run(message, command) {
        // return command && message.guild.settings.get("ignoredChannels").indexOf(message.channel.id) != -1;
    }
};
