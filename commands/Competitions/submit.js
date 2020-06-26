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
            extendedHelp: "https://docs.scramblr.app/docs/comps/submit"
        });
    }

    async run(message, [event, ...params]) {
        const settings = message.guild.settings;
        if (settings.comp.active) {
            if (event) {
                const disabledEvents = settings.comp.disabledEvents;
                if (getEnabled(disabledEvents).includes(event)) {
                    let avg, valid = 0, customCount = message.guild.settings.get(`comp.results.${getEvent(event)}.count`);
                    const count = settings.comp.classic ? 1 : customCount ? customCount : countScrambles(event); // if using classic submissions, defaults to 1, otherwise checks if a custom count is configured

                    if (params.length <= count) {
                        let times = [];
                        for (let i = 0; i < params.length; i++) {
                            if (params[i]) {
                                if (params[i].time) {
                                    times.push(params[i].time);
                                } else {
                                    times.push("DNF");
                                }
                                valid++;
                            } else {
                                let msgArr = message.content.split(" ");
                                return message.send(`Invalid time: \`${msgArr[i + 2]}\`. Please check your formatting and try again.`);
                            }
                        }
                        if (times.length == count) { // only if they submitted the right number of times.
                            if (count <= 4) {
                                avg = getMean(times);
                            } else {
                                avg = getAverage(times);
                            }

                            const results = settings.get(`comp.events.${event}.results`); // array of objects
                            const previousEntries = results && results.filter(entry => entry.user.id == message.author.id); // any previous entries with matching user id (max 1)
                            let previousEntry = previousEntries && previousEntries[0] ? previousEntries[0] : null;
                            previousEntry = previousEntry ? event == "fmc" ? previousEntry.average : formatTime(previousEntry.average) : null;
                            // removes the user's existing entry
                            if (previousEntries && previousEntries[0])
                                await settings.update(`comp.events.${event}.results`, previousEntries[0]);
                            // adds their new time to the array
                            await settings.update(`comp.events.${event}.results`, { user: message.author, times: times, average: avg });
                            return message.send(`Successfully submitted ${event} ${count == 1 ? "result" : count == 5 ? "average" : "mean"} of ${event == "fmc" ? avg : formatTime(avg)}. ${previousEntries.length > 0 ? `Your previous entry of \`${previousEntry}\` has been removed.` : ""}`);
                        } else {
                            return message.send(`Invalid submission format detected! Please ensure proper formatting and that you enter **${count}** solves. (You submitted ${valid}.)`);
                        }
                    } else {
                        return message.send(`You've submitted too many times! Please only enter **${count}** result(s) and try again.`);
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
 * @param {array} params Solve times or DNF's
 * @returns {string} DNF or average
 */
function getAverage(params) {
    let times = [...params];
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
        return average([...times]);
    }
}
