const { Argument } = require("klasa");
const { getEvent } = require(".././util/aliases.js");

module.exports = class extends Argument {
    run(arg, possible, message) {
        return getEvent(arg);
    }
};
