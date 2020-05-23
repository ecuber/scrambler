const { Command } = require("klasa");
const channelMention = arr => arr.map(id => `<#${id}>`);
const buildStr = (ignored, unignored) => {
    let on, off;
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

    async run(message, [type, ...params]) {
        let info = {
            currentChannels: message.guild.settings.ignored,
            channels: [],
            n: 0
        };
        if (info.currentChannels)
            info.n = info.currentChannels.length;
        if (type)
            return this[type](message, info, params);
        return this.other(message, info, params);
    }

    async view(message, { currentChannels, n }, params) {
        if (n > 0) {
            return message.send(`Scrambler is currently ignoring commands in the following channels: ${currentChannels.map(c => `<#${c}>`).join(", ")}`);
        } else {
            return message.send(`Scrambler is not ignoring any channels.`);
        }
    }

    async reset(message, info, params) {
        await message.prompt("Are you sure you want to reset channel restrictions? Respond **Y**/n", 5000).then(async response => {
            if (response && response.content.toLowerCase() === "y") {
                await message.guild.settings.reset("ignored");
                return message.send("Reset all channel restrictions.");
            } else {
                return message.send("Cancelled.");
            }
        });
    }

    async all(message, { channels }, params) {
        await message.guild.settings.reset("ignored");
        if (params[0] != null) {
            for (let i = 0; i < params.length; i++) {
                channels.push(params[i].id);
            }
        }
        for (let [id, channel] of message.guild.channels.cache) {
            if (channel.type === "text" && !channels.includes(id)) {
                await message.guild.settings.update("ignored", id, message.guild);
            }
        }
        channels = channelMention(channels);
        return message.send(`Scrambler will ignore commands in all channels${channels.length > 0 ? ` with the exception of ${channels.join(", ")}` : "."}`);
    }

    async other(message, { currentChannels, n }, params) {
        if (params[0]) {
            let ignored = [];
            let unignored = [];
            for (let i = 0; i < params.length; i++) {
                if (currentChannels && currentChannels.includes(params[i].id)) {
                    ignored.push(params[i]);
                } else {
                    unignored.push(params[i]);
                }
                await message.guild.settings.update("ignored", params[i], message.guild);
            }
            return message.send(buildStr(unignored, ignored));
        } else {
            return message.send(`Scrambler is currently ignoring commands in \`${n}\` channels. *Please mention a channel to toggle it.*`);
        }
    }
};
