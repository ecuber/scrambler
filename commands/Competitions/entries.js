const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { getName, formatTime } = require("../../util/competition");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "entries",
            runIn: ["text"],
            cooldown: 3,
            aliases: [],
            usage: "<event:name>",
            usageDelim: " ",
            description: "Shows entries for a certain event.",
            category: "Config"
        });
    }

    async run(message, [event, ...params]) {
        const comp = message.guild.settings.comp;
        if (event) {
            if (comp.active) {
                if (!comp.disabledEvents.includes(event) && comp.events[event] && comp.events[event].results) {
                    let entries = Object.keys(comp.events[event].results);
                    let embed = new MessageEmbed()
                        .setTitle(`${getName(event)} entries`)
                        .setColor("RANDOM")
                        .setTimestamp();
                    let list = [];
                    entries.forEach(entry => {
                        let { user, average, times } = comp.events[event].results[entry];
                        list.push({ user: user, avg: average, times: times });
                    });
                    list.sort((a, b) => a.avg - b.avg);
                    let i = 1;
                    list.forEach(entry => {
                        embed.addField(`${i}: **${entry.user.username}**#${entry.user.discriminator}`, formatTime(entry.avg), true);
                        i++;
                    });
                    return message.send(embed);
                } else {
                    return message.send("No results have been entered for this event.");
                }
            } else {
                return message.send("There isn't an active competition currently!");
            }
        } else {
            return message.send("Please specify a valid event!");
        }
    }
};
