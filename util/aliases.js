const events = require("./aliases.json");
let names = [];
Object.keys(events).forEach(key => {
    names.push({ name: key, level: 0 });
    events[key].forEach(alias => names.push({ name: alias, level: 1, parent: key }));
});

module.exports = {
    /**
     * Returns the event name. If string is not a valid event name, returns null
     * @param {string} string event input
     * @returns {string} event name
     */
    getEvent(string) {
        if (typeof string === "string") {
            let matches = names.filter(n => n.name === string.toLowerCase());
            if (matches.length > 0) {
                let obj = matches[0];
                return obj.level == 0 ? obj.name : obj.parent;
            }
        } else {
            return null;
        }
    },

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
    }
};
