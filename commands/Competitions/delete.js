const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "delete",
            runIn: ["text"],
            permissionLevel: 5,
            cooldown: 3,
            aliases: [],
            usage: "<user:user|id:uid> [event:name] [...]",
            usageDelim: " ",
            description: "Manages users' times in the server competition.",
            category: "Config"
        });
    }

    async run(message, [user, ...params]) {
        const settings = message.guild.settings;
        if (settings.comp.enabled) {
            if (settings.comp.active) {
                user = user.id ? user.id : user;
                if (user) {
                    if (params[0]) {
                        await message.prompt(`Are you sure you want to delete these entries from user with ID ${user}? **Y**/n`, 10000).then(response => {
                            if (response.content.toLowerCase().includes("y")) {
                                for (let i = 0; i < params.length; i++) {
                                    if (params[i]) {
                                        let results = settings.comp.events[params[i]].results;
                                        if (Object.prototype.hasOwnProperty.call(results, user)) {
                                            delete results[user];
                                        }
                                        settings.update(`comp.events.${params[i]}.results`, results);
                                    }
                                }
                                return message.send("Deleted!");
                            }
                        });
                    } else
                        return message.send("Please provide a valid event.");
                } else
                    return message.send("Please mention a valid user or provide a valid user ID.");
            } else
                return message.send("There isn't an active competition on this server.");
        } else
            return message.send("Competitions are not enabled on this server. To enable them, run \`s!config enable\`");
    }
};
