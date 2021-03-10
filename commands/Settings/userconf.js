const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            enabled: false,
            guarded: true,
            subcommands: true,
            description: language => language.get("COMMAND_CONF_USER_DESCRIPTION"),
            usage: "<set|show|remove|reset> (key:key) (value:value) [...]",
            usageDelim: " "
        });
    }
};
