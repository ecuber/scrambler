const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { getEvent, getEnabled } = require("../../util/aliases.js");
const buildStr = (enabled, disabled, str1, str2) => {
    let on, off;
    if (enabled.length > 0)
        on = `${str1} ${enabled.join(", ")}`;
    if (disabled.length > 0)
        off = `${str2} ${disabled.join(", ")}`;
    return `Scrambler has${on ? ` ${on}` : ""}${on && off ? " and" : ""}${off ? ` ${off}` : ""}.`;
};

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "config",
            runIn: ["text"],
            permissionLevel: 5,
            cooldown: 3,
            aliases: [],
            usage: "<view|enable|disable|events|mods|reset> [reset|mod:role|event:name] [...]",
            usageDelim: " ",
            description: "Configures Scrambler permissions and competitions.",
            category: "Config",
            extendedHelp: "See full documentation on this command here: https://scrambler.gitbook.io/docs/comps/config"
        });
    }

    async run(message, [type, ...params]) {
        return this[type](message, params);
    }
    async enable(message) {
        await message.guild.settings.update("comp.enabled", true);
        return message.send(`Competitions have been enabled on this server.`);
    }

    async disable(message) {
        await message.guild.settings.update("comp.enabled", false);
        return message.send(`Competitions have been disabled on this server.`);
    }

    async reset(message) {
        await message.guild.settings.reset(["comp.enabled", "comp.disabledEvents", "modRoles"]);
        return message.send("All competition settings have been reset to their default values.");
    }

    async events(message, params) {
        const disabledEvents = message.guild.settings.comp.disabledEvents;
        let enabled = [];
        let disabled = [];
        if (params[0] !== "reset" && getEvent(params[0])) {
            for (let i = 0; i < params.length; i++) {
                if (disabledEvents.includes(params[i]) && getEvent(params[i])) {
                    enabled.push(params[i]);
                } else if (getEvent(params[i])) {
                    disabled.push(params[i]);
                }
                await message.guild.settings.update("comp.disabledEvents", params[i], message.guild);
            }
            return message.send(buildStr(enabled.sort(), disabled.sort(), "enabled", "disabled"));
        } else if (params[0] === "reset") {
            await message.guild.settings.reset("comp.disabledEvents");
            return message.send("Scrambler has reset the events list.");
        } else {
            return message.send("Please select a valid event.");
        }
    }

    async mods(message, params) {
        const modRoles = message.guild.settings.modRoles;
        let enabled = [];
        let disabled = [];
        if (params[0] !== "reset" && message.guild.roles.cache.get(params[0].id)) {
            for (let i = 0; i < params.length; i++) {
                if (modRoles.includes(params[i].id)) {
                    disabled.push(params[i]);
                } else {
                    enabled.push(params[i]);
                }
                await message.guild.settings.update("modRoles", params[i], message.guild);
            }
            return message.send(buildStr(enabled, disabled, "added", "removed"));
        } else if (params[0] === "reset") {
            await message.guild.settings.reset("modRoles");
            return message.send("Scrambler has reset moderator roles.");
        } else {
            return message.send("Please mention a role or provide a valid role ID.");
        }
    }

    async view(message) {
        const settings = message.guild.settings;
        const comps = settings.comp.enabled;
        const disabledEvents = settings.comp.disabledEvents;
        const modRoles = settings.modRoles;
        const enabledEvents = getEnabled(disabledEvents).sort();

        return message.send(new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Competitions are **${comps ? "enabled" : "disabled"}**.`)
            .addField("Enabled Events", enabledEvents && enabledEvents.length > 0 ? enabledEvents.join(", ") : "None.")
            .addField("Disabled Events", disabledEvents && disabledEvents.length > 0 ? `${disabledEvents.sort().join(", ")}.` : "None.")
            .addField("Moderator Roles", modRoles && modRoles.length > 0 ? modRoles.map(r => message.guild.roles.cache.get(r).name).join(", ") : "None set."));
    }
};
