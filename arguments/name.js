const { Argument } = require("klasa");
const { getEvent } = require(".././util/competition");

module.exports = class extends Argument {
    run(arg, possible, message) {
        return getEvent(arg);
    }
};
