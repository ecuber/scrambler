const { Command } = require("klasa");
const channelMention = arr => arr.map(id => `<#${id}>`);
const buildStr = (ignored, unignored) => {
    let on, off;
    console.log(ignored);
    console.log(unignored);
    if (ignored.length > 0)
        on = `will ignore commands in ${ignored.join(", ")}`;
    if (unignored.length > 0)
        off = `will no longer ignore commands in ${unignored.join(", ")}`;
    return `Scrambler${on ? ` ${on}` : ""}${on && off ? " and" : ""}${off ? ` ${off}` : ""}.`;
};

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ignore",
            runIn: ["text"],
            permissionLevel: 5,
            cooldown: 3,
            aliases: [],
            usage: "[reset|all|view] [channels:channel] [...]",
            usageDelim: " ",
            description: "Configures channel ignore settings for Scrambler.",
            extendedHelp: "See full documentation on this command here: https://scrambler.gitbook.io/docs/util/ignore",
            category: "Config"
        });
    }

    async run(message, [...params]) {
        const reset = params[0] === "reset";
        const all = params[0] === "all";
        const view = params[0] === "view";
        const currentChannels = message.guild.settings.ignored;
        let channels = [];
        let n = 0;

        if (currentChannels) {
            n = currentChannels.length;
        }

        if (view) {
            if (n > 0) {
                return message.send(`Scrambler is currently ignoring commands in the following channels: ${currentChannels.map(c => `<#${c}>`).join(", ")}`);
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
                if (currentChannels && currentChannels.indexOf(params[i]) != -1) {
                    unignored.push(params[i]);
                } else {
                    ignored.push(params[i]);
                }
                await message.guild.settings.update("ignored", params[i], message.guild);
            }
            return message.send(buildStr(unignored, ignored));
        } else {
            return message.send(`Scrambler is currently ignoring commands in \`${n}\` channels. *Please mention a channel to toggle it.*`);
        }
    }
};
