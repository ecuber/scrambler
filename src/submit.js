const Discord = require("discord.js");
const events = { events: { "2x2": {}, "3x3": {}, "4x4": {}, "5x5": {}, "6x6": {}, "7x7": {}, "oh": {}, "clock": {}, "pyra": {}, "mega": {}, "skewb": {}, "squareone": {}, "redi": {}, "2x2x3": {}, "ivy": {} } };
const key = { "2x2": "twox", "3x3": "threex", "4x4": "fourx", "5x5": "fivex", "6x6": "sixx", "7x7": "sevenx", "oh": "oh", "clock": "clockx", "pyra": "pyrax", "mega": "megax", "skewb": "skewbx", "squareone": "squanx", "redi": "redi", "2x2x3": "x2x3", "ivy": "ivy" };
const aliases = { "2x2": [], "3x3": [], "4x4": [], "5x5": [], "6x6": [], "7x7": [], "oh": ["onehanded", "onehand", "one-handed", "one-hand"], "clock": [], "pyra": ["pyraminx"], "mega": ["megaminx"], "skewb": ["skoob"], "squareone": ["square-1", "sq1", "squareone", "square1", "square_one", "squan", "sq-1"], "redi": ["redicube", "redi-cube"], "2x2x3": [], "ivy": ["ivy-cube", "ivycube"] };


module.exports.run = async (bot, message, args, cube) => {
	if(args[0]) args[0] = args[0].toLowerCase();
	if(args[1]) args[1] = args[1].toLowerCase();
	if(!args[0] || args[0] == "help") {
		return message.channel.send(new Discord.RichEmbed()
			.setTitle("Submit Comp Times")
			.setColor("RANDOM")
			.setDescription("Usage: \`s!submit <event> <average/mean>\`")
			.addField("Formatting your time", "The correct format is **MM:SS:dd**. (M = minutes, S = seconds, d = decimal) Your average result should be as precise as possible, ideally with a decimal to the hundredths place. Do not include any +2 penalties. DNF penalties will be registered, however.")
			.addField("Updating submissions", "You should only submit one time, and that time should be your overall average. You *are* allowed to update your submission as many times as you need in case you made a typo when entering. Your most recent time is the one counted when podiums are posted.")
			.addField("Documentation", "https://scrambler.gitbook.io/docs/comps/submit"));
	}
	let guild = await bot.guildData.findOne({ guildID: message.guild.id });
	if(!guild || !guild.compConfig) return message.channel.send("Competitions are not yet enabled on this server. To enable them, have someone with the Manage Server permission do \`s!config toggle\`");
	let config = guild.compConfig;

	let results = await bot.compResults.findOne({ guildID: message.guild.id });
	if(!results) await bot.compResults.updateOne({ guildID: message.guild.id }, { $set: events }, { upsert: 1 });
	results = await bot.compResults.findOne({ guildID: message.guild.id });
	if(!results.events) results.events = {};
	results = results.events;

	if(!config.enabled) return message.channel.send("Competitions are not enabled on this server. To enable them, have someone with the Manage Server permission do \`s!config toggle\`");

	if(!args[1]) return message.channel.send("Please specify a time or event.");

	function timeInSeconds(str) {
		if(str.includes(":")) {
			let m = str.substring(0, str.indexOf(":"));
			let s = str.substring(str.indexOf(":") + 1);
			if(parseInt(m) && parseFloat(s)) {
				return parseInt(m) * 60 + parseFloat(s);
			}
		} else {
			if(str.includes(".")) {
				if(parseFloat(str)) {
					return parseFloat(str);
				}
			}
		}
		return NaN;
	}

	let obj;
	let keyified;
	let event;

	if(Object.keys(key).includes(args[0])) {
		keyified = key[args[0]];
		event = config[keyified];
	} else {
		Object.keys(aliases).forEach(arr => {
			if(aliases[arr].includes(args[0])) {
				args[0] = arr;
				keyified = key[arr];
				event = config[keyified];
			}
		});
	}

	// console.log(args[0]);
	// console.log(event);
	// console.log(keyified);

	if(!event) return message.channel.send(`Event ${args[0]} is not recognized. Run \`s!events\` to see the correct naming scheme.`);

	let evResults;
	if(!results[args[0]]) {
		results[args[0]] = {};
	}
	evResults = results[args[0]];
	if(event.enabled) {
		let result = args[1];
		let dnf = false;
		let currentdate = new Date();
		if(result.toLowerCase() == "dnf") dnf = true;
		obj = {
			userID: message.author.id,
			timestamp: `${currentdate.getMonth() + 1}/${currentdate.getDate()}/${currentdate.getFullYear()} @ ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`
		};
		if(!dnf) {
			if(timeInSeconds(result)) {
				obj.time = timeInSeconds(result).toFixed(2);
			} else {
				return message.channel.send(`Your submitted result \`${result}\` is invalid. Please enter it again in this format: \`M:SS.ss\` (Make sure you include at least one decimal place!)`);
			}
		} else {
			obj.dnf = true;
			obj.time = 172800;
		}
		evResults[message.author.id] = obj;
	} else {
		return message.channel.send(`Event \`${args[0]}\` is not enabled.`);
	}

	await bot.compResults.updateOne({ guildID: message.guild.id }, { $set: { events: results } });
	if(obj.dnf) return message.channel.send(`Successfully submitted ${args[0]} time of \`DNF\`!`);
	return message.channel.send(`Successfully submitted a ${event.name} time of \`${args[1]}\`!`);
};
module.exports.config = { name: "submit", aliases: ["submittime"] };
