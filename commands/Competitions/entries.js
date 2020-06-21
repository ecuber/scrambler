const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { getName, formatTime, getEnabled, isBestOf } = require("../../util/competition");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "entries",
            runIn: ["text"],
            cooldown: 3,
            aliases: [],
            usage: "[member:user][event:name]",
            usageDelim: " ",
            description: "Shows entries for a certain event or user.",
            extendedHelp: "https://docs.scramblr.app/docs/comps/view-entries"
        });
    }

    async run(message, [member, event, ...params]) {
        const comp = message.guild.settings.comp;
        if (comp.active) {
            if (event) {
                if (!comp.disabledEvents.includes(event) && comp.events[event] && comp.events[event].results) {
                    let entries = comp.events[event].results;
                    let embed = new MessageEmbed()
                        .setTitle(`${getName(event)} entries`)
                        .setColor("RANDOM")
                        .setTimestamp();
                    entries = sortResults(entries, event);
                    let i = 1;
                    entries.forEach(entry => {
                        if (i < 26) {
                            embed.addField(`${i}: **${entry.user.username}**#${entry.user.discriminator}`, formatTime(entry.avg), true);
                            i++;
                        }
                    });
                    return message.send(embed);
                } else {
                    return message.send("No results have been entered for this event.");
                }
            } else if (member) {
                let events = getEnabled(comp.disabledEvents);
                let count = 0;
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`${member.username}#${member.discriminator}'s entries`)
                    .setTimestamp();

                events.forEach(eve => {
                    let results = comp.events[eve].results;
                    let matches = results.filter(n => n.user.id == member.id);
                    if (matches[0]) {
                        const time = results[member.id].average;
                        embed.addField(eve, eve == "fmc" ? time : formatTime(time), true);
                        count++;
                    }
                });
                return message.send(count > 0 ? embed : `No entries for ${member.username}#${member.discriminator} found.`);
            } else {
                let events = getEnabled(comp.disabledEvents);
                let count = 0;
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription("Number of entries for each event. To see individual entries, try s!help entries")
                    .setTimestamp();

                events.forEach(eve => {
                    let results = comp.events[eve].results;
                    if (results) {
                        embed.addField(eve, `${results.length} entries`, true);
                        count++;
                    }
                });
                return message.send(count > 0 ? embed : "There are no entries for this competition.");
            }
        } else {
            return message.send("There isn't an active competition currently!");
        }
    }
};


/**
 * Sorts results by average then single if ties occur. For events
 * sorted by best result (FMC, BLD, etc.) it will ignore mean.
 * @param {Array<Object>} results Results in database format
 * @param {string} event Event name
 * @returns {Array<Object>} Sorted results
 */
function sortResults(results, event) {
    results.sort((a, b) => {
        if (!isBestOf(event)) {
            a.dnf = a.average == "DNF";
            b.dnf = b.average == "DNF";
            if (a.dnf && !b.dnf)
                return 1;
            else if (!a.dnf && a.dnf)
                return -1;
            else if (a.dnf && b.dnf) {
                a.times = spliceDNF(a.times);
                b.times = spliceDNF(b.times);
                return compare(a.times, b.times);
            } else {
                if (a.average - b.average != 0)
                    return a.average - b.average;
                return compare(a.times, b.times);
            }
        } else {
            return compare(spliceDNF(a.times), spliceDNF(b.times));
        }
    });
    return results;
}
/**
 * Removes all DNFs from an array
 * @param {Array<string>} array Array of times
 * @returns {Array<string>} Same array but without the DNFs
 */
function spliceDNF(array) {
    while (array.includes("DNF")) {
        array.splice(array.indexOf("DNF"), 1);
    }
    return array;
}

const intSort = (a, b) => a - b;

/**
 * Compares two arrays to see which has the lower value.
 * @param {Array<number>} arr1 First arr
 * @param {Array<number>} arr2 Second arr
 * @returns {number} Negative if arr2 > arr 1, positive if arr1 > arr2, 0 if equal
 */
function compare(arr1, arr2) {
    let a = [...arr1], b = [...arr2];
    a.sort(intSort);
    b.sort(intSort);
    let min1 = Math.min(...a), min2 = Math.min(...b);
    while (min1 - min2 == 0 && a.length > 1 && b.length > 1) {
        a.splice(0, 1);
        b.splice(0, 1);
        min1 = Math.min(...a);
        min2 = Math.min(...b);
    }
    return min1 - min2;
}
