const { Argument } = require("klasa");

module.exports = class extends Argument {
    run(arg, possible, message) {
        return new RegExp(/^[0-9]{18}$/g).test(arg);
    }
};
