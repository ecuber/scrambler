const events = require("./aliases.json");
const cube = require("scrambler-util");
let names = [];
// Initializes names array
Object.keys(events).forEach(key => {
    names.push({ name: key, level: 0 });
    events[key].aliases.forEach(alias => names.push({ name: alias, level: 1, parent: key }));
});

/**
 * Returns the event name. If string is not a valid event name, returns null
 * @param {string} string event input
 * @returns {string} event name
 */
function getEvent(string) {
    if (typeof string === "string") {
        let matches = names.filter(n => n.name === string.toLowerCase());
        if (matches.length > 0) {
            let obj = matches[0];
            return obj.level == 0 ? obj.name : obj.parent;
        }
    } else {
        return null;
    }
}

module.exports = {
    getEvent,

    /**
     * Returns an array of top-level events that are not included in the array.
     * @param {array} disabled disabled events
     * @returns {array} Enabled events
     */
    getEnabled(disabled) {
        let list = [];
        let event;
        for (let i = 0; i < names.length; i++) {
            event = names[i];
            if (event.level == 0 && (!disabled || !disabled.includes(event.name)))
                list.push(event.name);
        }
        return list;
    },

    /**
     * Returns an array of all event names
     * @returns {Array<string>} An array of all event names
     */
    getEvents() {
        return names.filter(obj => obj.level == 0).sort().map(obj => obj.name);
    },

    /**
     * Returns the scramble type for the specified event.
     * @param {string} event An event name or alias
     * @returns {string} Scramble type
     */
    getType(event) {
        if (events[getEvent(event)])
            return events[getEvent(event)].type;
        throw new Error(`Unrecognized event: ${event}`);
    },

    /**
     * Returns the formatted & capitalized name of an event
     * @param {string} event An event name or alias
     * @returns {string} Formatted name
     */
    getName(event) {
        if (events[getEvent(event)])
            return events[getEvent(event)].name;
        throw new Error(`Unrecognized event: ${event}`);
    },

    /**
     * Returns the number of scrambles for the specified event.
     * @param {string} event An event name or alias
     * @returns {Integer} Number of scrambles
     */
    countScrambles(event) {
        if (events[getEvent(event)])
            return events[getEvent(event)].scrambles;
        throw new Error(`Unrecognized event: ${event}`);
    },

    /**
     * Returns an array of scrambles for the specified event.
     * @param {string} event A valid event name or alias (uses module built-in aliases)
     * @param {int} count A positive integer for the number of scrambles
     * @param {string} args Whether scrambles should have FMC or BLD moves added on. Applicable for 2x2-5x5.
     * @returns {Array<string>} Scrambles for this event
     */
    getScrambles(event, count = this.countScrambles(event), args = null) {
        return cube(event, count, args);
    },

    /**
     * Formats time from seconds to MM:SS.ss if necessary,
     * otherwise rounds to 3 decimal places.
     * @param {float} time A time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(time) {
        if (time != "DNF") {
            if (time > 60) {
                let m = Math.floor(time / 60);
                let s = (time % 60).toFixed(2);
                if (Math.floor(time % 60) < 10)
                    s = `0${s}`;
                return `${m}:${s}`;
            } else {
                return parseFloat(time).toFixed(2);
            }
        }
        return "DNF";
    }
};
