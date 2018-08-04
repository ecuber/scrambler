module.exports.run = async (bot, message, args, cube) => {
	if(!["327256747473633301", "191380396586303489"].includes(message.author.id)) return;
	const clean = text => {
		if(typeof text === "string") {
			return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
		} else {
			return text;
		}
	};
	try {
		const { inspect } = require("util");
		const code = args.join(" ");
		let hrstart = process.hrtime();
		let evaled = eval(code);
		let evaledStr = evaled;
		if(evaled instanceof Promise) evaledStr = await evaledStr;
		if(typeof evaled !== "string") {
			evaledStr = inspect(evaledStr, { depth: 0, showHidden: true });
		}
		evaledStr = evaledStr.replace(bot.token, "gotem");
		let hrend = process.hrtime(hrstart);
		message.channel.send(`:white_check_mark: Output: \`\`\`javascript\n${clean(evaledStr)}\n\`\`\`\nType: \`${typeof evaled}\` | Time Elapsed: \`${hrend[0]}s | ${hrend[1] / 1000000}ms\``);
	} catch(err) {
		message.channel.send(`:x: Error: \`\`\`javascript\n${clean(err)}\n\`\`\``);
	}
};

module.exports.config = { name: "eval", aliases: ["evaluate"] };
