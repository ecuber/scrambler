const { Command } = require("klasa");
const { getEnabled, countScrambles, getType, getName, formatTime } = require("../../util/competition");
const cube = require("scrambler-util");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "comp",
            runIn: ["text"],
            permissionLevel: 5,
            cooldown: 3,
            aliases: [],
            usage: "<start|end>",
            usageDelim: " ",
            description: "Starts and ends the server competition.",
            category: "Config"
        });
    }

    async run(message, type) {
        const settings = message.guild.settings;
        if (settings.comp.enabled)
            return this[type](message, settings);
        return message.send("Competitions are not enabled on this server. To enable them, run \`s!config enable\`");
    }

    async start(message, settings) {
        if (settings.comp.active) {
            return message.send("There is already a competition active. Please end it to start a new one.");
        } else {
            await settings.update("comp.active", true);
            await message.channel.send("Loading scrambles... Please wait.");
            const enabledEvents = getEnabled(settings.comp.disabledEvents);
            let scrambles = [];

            // Generates all scrambles and adds to the array
            enabledEvents.forEach(async event => {
                let scrambleType = getType(event);
                let arg = event == "fmc" ? "fmc" : event.includes("bld") ? "bld" : undefined;
                let count = settings.get(`comp.events.${event}.count`);
                if (!count)
                    count = countScrambles(event);
                await scrambles.push({ event: event, scrambles: cube(scrambleType, count, arg) });
            });

            // Saves scrambles
            scrambles.forEach(obj => obj.scrambles.forEach(scr => settings.update(`comp.scrambles.${obj.event}`, scr)));

            // Formats scrambles array
            scrambles = scrambles.map(set => set.scrambles = numberList(getName(set.event), set.scrambles));

            // Combines scrambles into 2000-character long blocks
            let msgArr = condense(scrambles);

            for (let i = 0; i < msgArr.length; i++) {
                await message.channel.send(msgArr[i]);
            }
            return message.channel.send("Scramble generation complete! Good luck!");
        }
    }

    async end(message, settings) {
        if (!settings.comp.active) {
            return message.send("There is no active competition.");
        } else {
            const enabledEvents = getEnabled(settings.comp.disabledEvents);
            message.prompt("Are you sure you want to end this competition? **Y**/n", 10000).then(async response => {
                if (response.content.toLowerCase().includes("y")) {
                    await message.guild.settings.update("comp.active", false);
                    let msgArr = [];
                    enabledEvents.forEach(event => {
                        if (settings.comp.events[event].results) {
                            let podium = ["", "", ""];
                            let sorted = sortResults(objToArray(settings.comp.events[event].results));
                            let lim = sorted.length >= 3 ? 3 : sorted.length;
                            for (let i = 0; i < lim; i++) {
                                // Makes sure user is still in guild. If not, skips entry.
                                if (sorted[i]) {
                                    let user = message.guild.members.cache.get(sorted[i].user.id);
                                    if (user) {
                                        let single = sorted[i].times.length > 0 ? ` and a single of ${formatTime(Math.min(...spliceDNF(sorted[0].times)))}!` : "!";
                                        podium[i] = `${user} with a time of ${formatTime(sorted[0].average)}${single}`;
                                    } else if (i < sorted.length) {
                                        lim++;
                                    }
                                }
                            }
                            if (podium[0]) {
                                let str = `\n\n**${getName(event)} Podium**\n1st: **${podium[0]}**`;
                                if (podium[1])
                                    str += `\n2nd: ${podium[1]}`;
                                if (podium[2])
                                    str += `\n3rd: ${podium[2]}`;
                                msgArr.push(str);
                                settings.reset([`comp.events.${event}.results`, `comp.scrambles.${event}`]);
                            }
                        }
                    });
                    msgArr = condense(msgArr);
                    if (msgArr[0]) {
                        msgArr.forEach(block => {
                            if (block)
                                message.channel.send(block);
                        });
                        return message.send("Done!");
                    }
                    return message.send("No results found.");
                }
            });
        }
    }
};

/**
 * @param {string} event String event name
 * @param {Array<string>} array Array of strings
 * @returns {string} Titled, concatenated strings with numbered lines.
 */
function numberList(event, array) {
    for (let i = 0; i < array.length; i++)
        array[i] = `${i + 1}: ${array[i]}`;
    return `**${event} Scrambles**\n\`\`\`${array.join("\n\n")}\`\`\``;
}

/**
 * Combines strings into 2000 character blocks.
 * @param {Array<Object>} strArr Array of strings.
 * @returns {Array<string>} Condensed scrambles.
 */
function condense(strArr) {
    let eventIndex = 0, msgIndex = 0, msgArr = [""], msgLength, curStr;
    while (eventIndex < strArr.length) {
        msgLength = msgArr[msgIndex].length;
        curStr = strArr[eventIndex];
        if (msgLength < 2000 && (2000 - msgLength) > strArr[eventIndex].length) {
            msgArr[msgIndex] += curStr;
            eventIndex++;
        } else {
            msgIndex++;
            eventIndex++;
            msgArr.push(curStr);
        }
    }
    return msgArr;
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
    arr1.sort(intSort);
    arr2.sort(intSort);
    let min1 = Math.min([...arr1]), min2 = Math.min([...arr2]);
    while (min1 - min2 != 0 && arr1.length > 1 && arr2.length > 1) {
        arr1.splice(0, 1);
        arr2.splice(0, 1);
        min1 = Math.min([...arr1]);
        min2 = Math.min([...arr2]);
    }
    return min1 - min2;
}

/**
 * Returns de-key'ed objects from an object in an array.
 * @param {Object} obj object with keys
 * @returns {Array<Object>} contents of each key
 */
function objToArray(obj) {
    let arr = [];
    Object.keys(obj).forEach(key => {
        arr.push(obj[key]);
    });
    return arr;
}

/**
 * Sorts results by average then single if ties occur.
 * @param {Array<Object>} results Results in database format
 * @returns {Array<Object>} Sorted results
 */
function sortResults(results) {
    results.sort((a, b) => {
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
    });
    return results;
}
