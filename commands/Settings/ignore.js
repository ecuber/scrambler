const { Command } = require("klasa");
const channelMention = arr => arr.map(id => `<#${id}>`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ignore",
            runIn: ["text"],
            permissionLevel: 6,
            cooldown: 3,
            aliases: ["restrict"],
            usage: "[reset|all|view] [channels:channel] [...]",
            usageDelim: " ",
            description: "Configures channel ignore settings for Scrambler.",
            category: "Config"
        });
    }

    async run(message, [...params]) {
        let reset = RegExp(/\breset\b/gi).test(params[0]);
        let all = RegExp(/\ball\b/gi).test(params[0]);
        let view = RegExp(/\bview\b/gi).test(params[0]);
        let channels = [];

        if (!message.guild.settings.ignoredChannels) {
            message.guild.settings.ignoredChannels = [];
        }
        if (reset || all) {
            await message.guild.settings.reset("ignoredChannels");
            if (all) {
                if (params[1] != null) {
                    for (let i = 1; i < params.length; i++) {
                        channels.push(params[i].id);
                    }
                }
                for (let channel in message.guild.channels.cache) {
                    if (channel.type === "text" && channels.indexOf(channel.id) != -1)
                        message.guild.settings.update("ignoredChannels", channel.id, message.guild.id);
                }
                channels = channelMention(channels);
                return message.send(`Scrambler will ignore commands in all channels${channels.length > 0 ? ` with the exception of ${channels.join(", ")}` : "."}`);
            }
            return message.send("Reset all channel restrictions.");
        } else if (params[1]) {
            let ignored = [];
            let unignored = [];
            for (let i = 1; i < params.length; i++) {
                let channelID = params[i].id;
                if (message.guild.settings.ignoredChannels.indexOf(channelID) != -1) {
                    unignored.push(`<#${channelID}>`);
                } else {
                    ignored.push(`<#${channelID}>`);
                }
                message.guild.settings.update("ignoredChannels", params[i].id, message.guild);
            }
            let iN = ignored.length;
            let uN = unignored.length;
            return message.send(`Scrambler will ${iN > 0 ? `ignore commands in ${ignored.join(", ")}` : ""}${iN > 0 && uN > 0 ? " and " : "."}${uN > 0 ? `no longer ignore commands in ${unignored.join(", ")}.` : ""}`);
        } else {
            let n = 0;
            if (message.guild.settings.ignoredChannels) {
                n = message.guild.settings.ignoredChannels.length;
            }
            return message.send(`Scrambler is currently ignoring commands in \`${n}\` channels. Please mention a channel to toggle it.`);
        }
    }
};
