const { Command } = require("klasa");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "prefix",
            runIn: ["text"],
            permissionLevel: 6,
            cooldown: 3,
            aliases: [],
            usage: "[reset|Prefix:String]",
            usageDelim: " ",
            description: "Sets a custom prefix for Scrambler.",
            category: "Config"
        });
    }

    async run(message, [...params]) {
        // console.log(params);
        let reset = RegExp(/\breset\b/gi).test(params[0]);
        if (params[0]) {
            await message.guild.settings.update("prefix", reset ? "s!" : params[0]);
            return message.send(`Successfully ${reset ? "reset" : "updated"} your prefix to \`${message.guild.settings.prefix}\``);
        } else {
            return message.send(`Your prefix is \`${message.guild.settings.prefix}\`. To change it, use \`${message.guild.settings.prefix}help prefix\`.`);
        }
    }
};
