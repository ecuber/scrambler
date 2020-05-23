const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { getEvent, getEnabled } = require("../../util/competition.js");
const buildStr = (enabled, disabled, str1, str2) => {
    let on, off;
    if (enabled.length > 0)
        on = `${str1} ${enabled.join(", ")}`;
    if (disabled.length > 0)
        off = `${str2} ${disabled.join(", ")}`;
    return `Scrambler has${on ? ` ${on}` : ""}${on && off ? " and" : ""}${off ? ` ${off}` : ""}.`;
};
const isRole = (guild, id) => guild.roles.cache.get(id) != undefined;
const isUser = (guild, id) => guild.members.cache.get(id) != undefined;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "config",
            runIn: ["text"],
            permissionLevel: 5,
            cooldown: 3,
            aliases: [],
            // TODO: When changing an event's scramble count, only takes int parameter when it's an alias of an event.
            usage: "<view|enable|disable|events|mods|ban|reset> [mod:role|user:user|event:name|reset] [...]",
            usageDelim: " ",
            description: "Configures Scrambler permissions and competitions.",
            category: "Config",
            extendedHelp: "See full documentation on this command here: https://scrambler.gitbook.io/docs/comps/config"
        });
    }

    async run(message, [type, ...params]) {
        if (type)
            return this[type](message, params);
    }
    async enable(message) {
        if (message.guild.settings.comp.active) {
            return message.send("There is already a competition active!");
        }
        await message.guild.settings.update("comp.enabled", true);
        return message.send(`Competitions have been enabled on this server.`);
    }

    async disable(message) {
        if (message.guild.settings.comp.active) {
            return message.send("Cannot disable competitions while a competition is active!");
        }
        await message.guild.settings.update("comp.enabled", false);
        return message.send(`Competitions have been disabled on this server.`);
    }

    async reset(message) {
        if (message.guild.settings.comp.active) {
            return message.send("Cannot reset settings while a competition is active!");
        }
        await message.guild.settings.reset(["comp.enabled", "comp.disabledEvents"]);
        await Object.keys(message.guild.settings.comp.events).forEach(e => {
            message.guild.settings.reset([`comp.events.${e}.count`]);
        });
        return message.send("All competition configuration settings have been reset to their default values.");
    }

    async events(message, params) {
        if (message.guild.settings.comp.active)
            return message.send("Cannot change event settings while a competition is active!");
        const disabledEvents = message.guild.settings.comp.disabledEvents;
        let enabled = [], disabled = [], event = getEvent(params[0]);
        if (params[0] !== "reset" && event) {
            // Sets scramble count
            if (params[1] && parseInt(params[1])) {
                let count = parseInt(params[1]);
                if (count > 0 && count <= 5) {
                    let obj = await message.guild.settings.get(`comp.events.${event}`);
                    let warn = disabledEvents.includes(params[0]) ? ` Please note that you currently have ${event} disabled.` : "";
                    obj.count = count;
                    await message.guild.settings.update(`comp.events.${event}`, obj);
                    return message.send(`Updated number of ${event} scrambles to ${count} for the next competition.${warn}`);
                }
                return message.send("Please enter a number between 1 and 5.");
            }
            // Toggles events
            for (let i = 0; i < params.length; i++) {
                if (getEvent(params[i])) {
                    if (disabledEvents.includes(params[i])) {
                        enabled.push(params[i]);
                    } else if (getEvent(params[i])) {
                        disabled.push(params[i]);
                    }
                    await message.guild.settings.update("comp.disabledEvents", params[i]);
                }
            }
            return message.send(buildStr(enabled.sort(), disabled.sort(), "enabled", "disabled"));
        } else if (params[0] === "reset") {
            await message.guild.settings.reset("comp.disabledEvents");
            await Object.keys(message.guild.settings.comp.events).forEach(e => {
                message.guild.settings.reset(`comp.events.${e}.count`);
            });
            return message.send("Scrambler has reset the events list.");
        } else {
            return message.send("Please select a valid event.");
        }
    }

    async mods(message, params) {
        const modRoles = message.guild.settings.modRoles;
        let enabled = [];
        let disabled = [];
        if (params[0] !== "reset" && isRole(message.guild, params[0].id)) {
            for (let i = 0; i < params.length; i++) {
                if (params[i] === "reset")
                    continue;
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

    async ban(message, params) {
        const folder = message.guild.settings.banned;
        let highestRole = message.member.roles.highest;
        let banned = [];
        let unbanned = [];
        let unbannable = [];
        if (params[0] && params[0] !== "reset") {
            for (let i = 0; i < params.length; i++) {
                if (params[i] == "reset")
                    continue;
                let paramID = params[i].id;
                if (isRole(message.guild, paramID)) {
                    if (highestRole.comparePositionTo(paramID) > 0) {
                        if (folder.roles.includes(paramID)) {
                            unbanned.push(params[i]);
                        } else {
                            banned.push(params[i]);
                        }
                        await message.guild.settings.update("banned.roles", params[i], message.guild);
                    } else {
                        unbannable.push(params[i]);
                    }
                } else if (isUser(message.guild, paramID)) {
                    if (highestRole.comparePositionTo(message.guild.members.cache.get(params[i].id).roles.highest) > 0) {
                        if (folder.users.includes(paramID)) {
                            unbanned.push(params[i]);
                        } else {
                            banned.push(params[i]);
                        }
                        await message.guild.settings.update("banned.users", params[i], message.guild);
                    } else {
                        unbannable.push(params[i]);
                    }
                }
            }
            if (banned.length > 0 || unbanned.length > 0) {
                let updates = buildStr(banned, unbanned, "banned", "unbanned");
                return message.send(`${updates.slice(0, updates.length - 1)} from competitions.`);
            } else if (unbannable.length > 0) {
                return message.send(`Insufficient permissions to ban the following roles/users: ${unbannable.join(", ")}.`);
            }
        } else if (params[1] === "reset") {
            await message.guild.settings.reset("banned");
            return message.send("Scrambler has reset banned roles and users.");
        }
        return message.send("Please mention a role/user or provide a valid role/user ID.");
    }

    async view(message) {
        const settings = message.guild.settings;
        const comps = settings.comp.enabled;
        const disabledEvents = settings.comp.disabledEvents;
        const modRoles = settings.modRoles;
        const banned = settings.banned;
        const bRoles = banned.roles;
        const bUsers = banned.users;
        const enabledEvents = getEnabled(disabledEvents).sort();

        return message.send(new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Competitions are **${comps ? "enabled" : "disabled"}**.`)
            .addField("Enabled Events", enabledEvents && enabledEvents.length > 0 ? enabledEvents.join(", ") : "None.")
            .addField("Disabled Events", disabledEvents && disabledEvents.length > 0 ? `${disabledEvents.sort().join(", ")}.` : "None.")
            .addField("Moderator Roles", modRoles && modRoles.length > 0 ? modRoles.map(r => message.guild.roles.cache.get(r).name).join(", ") : "None set.")
            .addField("Banned Roles", bRoles && bRoles.length > 0 ? bRoles.map(n => message.guild.roles.cache.get(n).name).join(", ") : "None.")
            .addField("Banned Users", bUsers && bUsers.length > 0 ? bUsers.map(n => {
                let user = message.guild.members.cache.get(n).user;
                return `${user.username}#${user.discriminator}`;
            }).join(", ") : "None."));
    }
};
