const { Command } = require("klasa");
const { countScrambles, getEvent, getEnabled, formatTime } = require("../../util/competition");
const lowest = (array) => Math.min(...array);
const highest = (array) => Math.max(...array);
const average = (array) => array.reduce((a, b) => a + b, 0) / array.length;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "submit",
            runIn: ["text"],
            cooldown: 3,
            aliases: [],
            usage: "<event:name> [solve:result] [...]",
            usageDelim: " ",
            description: "Submits times to the server competition.",
            category: "Config"
        });
    }

    async run(message, [event, ...params]) {
        if (message.guild.settings.comp.active) {
            if (event) {
                const disabledEvents = message.guild.settings.comp.disabledEvents;
                if (getEnabled(disabledEvents).includes(event)) {
                    let avg, customCount = message.guild.settings.get(`comp.results.${getEvent(event)}.count`);
                    const count = customCount ? customCount : countScrambles(event);
                    if (params.length == count) {
                        let times = [];
                        for (let i = 0; i < params.length; i++) {
                            if (params[i]) {
                                if (params[i].time) {
                                    times.push(params[i].time);
                                } else {
                                    times.push("DNF");
                                }
                            } else {
                                let msgArr = message.content.split(" ");
                                return message.send(`Invalid time: \`${msgArr[i + 2]}\`. Please check your formatting and try again.`);
                            }
                        }
                        if (count <= 4) {
                            avg = getMean(times);
                        } else {
                            avg = getAverage(times);
                        }

                        let results = message.guild.settings.get(`comp.events.${event}.results`);
                        if (!results)
                            results = {};
                        const hasEntry = Object.prototype.hasOwnProperty.call(results, message.author.id);
                        const previousEntry = hasEntry ? results[message.author.id] : null;
                        results[message.author.id] = { user: message.author, times: times, average: avg };
                        await message.guild.settings.update(`comp.events.${event}.results`, results);

                        return message.send(`Successfully submitted ${event} ${count == 1 ? "single" : count == 5 ? "average" : "mean"} of ${formatTime(avg)}. ${hasEntry ? `Your previous entry of \`${formatTime(previousEntry.average)}\` has been removed.` : ""}`);
                    } else {
                        return message.send(`Invalid submission format detected! Make sure your times are formatted correctly and you've submitted the correct number of solves. *(You submitted **${params.length}** valid solve(s) but should have submitted **${count}**.)*`);
                    }
                } else {
                    return message.send("This event is disabled.");
                }
            } else {
                return message.send("Please provide a valid event name.");
            }
        } else {
            return message.send("There is no active competition currently.");
        }
    }
};

/**
 * Returns an average of 5 solves, highest and lowest removed.
 * @param {array} times Solve times or DNF's
 * @returns {string} DNF or average
 */
function getAverage(times) {
    let dnfs = times.filter(n => n == "DNF");
    if (dnfs.length >= 2) {
        return "DNF";
    } else {
        if (dnfs.length == 1) {
            times.splice(times.indexOf("dnf"), 1);
        } else {
            times.splice(times.indexOf(highest(times)), 1);
        }
        times.splice(times.indexOf(lowest(times)), 1);
        return average(times);
    }
}

/**
 * @param {array} times Array of times
 * @returns {string} DNF or average
 */
function getMean(times) {
    let dnfs = times.filter(n => n == "DNF");
    if (dnfs.length > 0) {
        return "DNF";
    } else {
        return average(times);
    }
}
