const { Command, Stopwatch, Type, util } = require("klasa");
const { inspect } = require("util");
const settings = require("../../settings.json");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ev"],
            permissionLevel: 10,
            guarded: true,
            description: language => language.get("COMMAND_EVAL_DESCRIPTION"),
            extendedHelp: language => language.get("COMMAND_EVAL_EXTENDEDHELP"),
            usage: "<expression:str>"
        });
    }

    async run(message, [code]) {
        const clean = text => {
            if (typeof text === "string") {
                return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
            } else {
                return text;
            }
        };
        try {
            let hrstart = process.hrtime();
            let evaled = eval(code);
            let evaledStr = evaled;
            if (evaled instanceof Promise) evaledStr = await evaledStr;
            if (typeof evaled !== "string") {
                evaledStr = inspect(evaledStr, { depth: 0, showHidden: true });
            }
            evaledStr = evaledStr.replace(settings.token, "gotem");
            let hrend = process.hrtime(hrstart);
            message.send(`:white_check_mark: Output: \`\`\`javascript\n${clean(evaledStr)}\n\`\`\`\nType: \`${typeof evaled}\` | Time Elapsed: \`${hrend[0]}s | ${hrend[1] / 1000000}ms\``);
        } catch (err) {
            message.send(`:x: Error: \`\`\`javascript\n${clean(err)}\n\`\`\``);
        }
    }
};
