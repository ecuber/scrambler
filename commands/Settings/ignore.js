const { Command } = require("klasa");
const channelMention = arr => arr.map(id => `<#${id}>`);

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ignore",
            runIn: ["text"],
            permissionLevel: 6,
            cooldown: 3,
            aliases: [],
            usage: "[reset|all|view] [channels:channel] [...]",
            usageDelim: " ",
            description: "Configures channel ignore settings for Scrambler.",
            extendedHelp: "Mentioning a channel will toggle its ignore status. (i.e. active channels will be ignored, ignored channels will be reactivated.) Additionally, you can have scrambler ignore all channels except a list of channels with \`s!ignore all #channel1 #channel2\`",
            category: "Config"
        });
    }

    async run(message, [...params]) {
        let reset = RegExp(/\breset\b/gi).test(params[0]);
        let all = RegExp(/\ball\b/gi).test(params[0]);
        let view = RegExp(/\bview\b/gi).test(params[0]);
        let currentChannels = message.guild.settings.ignored;
        let channels = [];
        let n = 0;
        if (currentChannels) {
            n = currentChannels.length;
        }

        if (view) {
            if (n > 0) {
                return message.send(`Scrambler is currently ignoring commands in the following channels: \n-${currentChannels.map(c => `<#${c}>`).join("\n- ")}`);
            } else {
                return message.send(`Scrambler is not ignoring any channels.`);
            }
        } else if (reset || all) {
            await message.guild.settings.reset("ignored");
            if (all) {
                if (params[1] != null) {
                    for (let i = 1; i < params.length; i++) {
                        channels.push(params[i].id);
                    }
                }
                for (let [id, channel] of message.guild.channels.cache) {
                    if (channel.type === "text" && channels.indexOf(id) == -1) {
                        await message.guild.settings.update("ignored", id, message.guild);
                    }
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
                if (currentChannels && currentChannels.indexOf(channelID) != -1) {
                    unignored.push(`<#${channelID}>`);
                } else {
                    ignored.push(`<#${channelID}>`);
                }
                await message.guild.settings.update("ignored", channelID, message.guild);
            }
            let i = ignored.length;
            let u = unignored.length;
            return message.send(`Scrambler will ${i > 0 ? `ignore commands in ${ignored.join(", ")}` : ""}${i > 0 && u > 0 ? " and " : u > 0 ? "" : "."}${u > 0 ? `no longer ignore commands in ${unignored.join(", ")}.` : ""}`);
        } else {
            return message.send(`Scrambler is currently ignoring commands in \`${n}\` channels. Please mention a channel to toggle it.`);
        }
    }
};
