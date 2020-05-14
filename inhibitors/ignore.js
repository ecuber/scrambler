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
        let ignored = message.guild.settings.ignored;
        return command != "ignore" && ignored && ignored.indexOf(message.channel.id) != -1;
    }
};
