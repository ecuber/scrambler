const { Argument } = require("klasa");
const getFloat = string => [...string].filter(char => char == "." || !isNaN(parseInt(char))).length == string.length ? parseFloat(string) : null;
const getInt = string => [...string].filter(char => parseInt(char)).length == string.length ? parseInt(string) : null;
const timeInSeconds = (input) => {
    let m, s, hasDecimal;
    if (input && input.includes(":")) {
        let solve = input.split(":");
        if (solve.length == 2) {
            m = getInt(solve[0]);
            s = getFloat(solve[1]);
            hasDecimal = solve[1].split(".").length > 1;
            if (m && s) {
                if (m < 60 && s < 60) {
                    const calc = m * 60 + s;
                    if (calc > 0) {
                        return {
                            time: calc,
                            notes: hasDecimal ? null : "Reminder: It is recommended to have at least two decimal places of precision for each submission."
                        };
                    } else {
                        throw new Error(`Invalid input: ${input}`);
                    }
                } else {
                    throw new Error(`Invalid input: ${input}`);
                }
            }
        } else {
            throw new Error(`Invalid input: ${input}`);
        }
    } else if (input && getFloat(input)) {
        hasDecimal = input.split(".").length > 1;
        s = getFloat(input);
        if (s) {
            if (s < 90 && s > 0) {
                return {
                    time: s,
                    notes: hasDecimal ? null : "Reminder: It is recommended to have at least two decimal places of precision for each submission."
                };
            } else {
                throw new Error("Please use time format MM:SS.ss");
            }
        } else {
            throw new SyntaxError(`"Invalid input: ${input}`);
        }
    }
    return null;
};

module.exports = class extends Argument {
    run(arg, possible, message) {
        if (arg.toLowerCase() == "dnf") {
            return { time: null, notes: "DNF" };
        }
        return timeInSeconds(arg);
    }
};
