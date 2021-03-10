const { Inhibitor } = require("klasa");

module.exports = class extends Inhibitor {
    constructor(...args) {
        super(...args, {
            name: "banned",
            enabled: true,
            spamProtection: false
        });
    }

    async run(message, command) {
        let banned = message.guild.settings.banned;
        let bannedRole = banned.roles.filter(role => message.member._roles.includes(role)).length > 0;
        let userBanned = banned.users.includes(message.author.id);
        return command == "submit" && (banned.roles || banned.users) && (bannedRole || userBanned) ? "You are banned from competitions." : false;
    }
};
