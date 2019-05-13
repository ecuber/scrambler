const Discord = require("discord.js");
const eventList = ["2x2", "3x3", "4x4", "5x5", "6x6", "7x7", "oh", "clock", "pyra", "mega", "skewb", "squareone", "redi", "2x2x3", "ivy"];
const key = { "2x2": "twox", "3x3": "threex", "4x4": "fourx", "5x5": "fivex", "6x6": "sixx", "7x7": "sevenx", "oh": "oh", "clock": "clockx", "pyra": "pyrax", "mega": "megax", "skewb": "skewbx", "squareone": "squanx", "redi": "redi", "2x2x3": "x2x3", "ivy": "ivy" };
const aliases = { "2x2": [], "3x3": [], "4x4": [], "5x5": [], "6x6": [], "7x7": [], "oh": ["onehanded", "onehand", "one-handed", "one-hand"], "clock": [], "pyra": ["pyraminx"], "mega": ["megaminx"], "skewb": ["skoob"], "squareone": ["square-1", "sq1", "squareone", "square1", "square_one", "squan", "sq-1"], "redi": ["redicube", "redi-cube"], "2x2x3": [], "ivy": ["ivy-cube", "ivycube"] };


module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do no have permission to use this command. Missing permission: `MANAGE_MESSAGES`").then(msg => msg.delete(7000));
	let guild = await bot.guildData.findOne({ guildID: message.guild.id });
	if(!guild || !guild.compConfig) return message.channel.send("Competitions are not yet enabled on this server. To enable them, have someone with the Manage Server permission do \`s!config toggle\`");
	let config = guild.compConfig;

	let results = await bot.compResults.findOne({ guildID: message.guild.id });
	if(!results) return message.channel.send("There are no entered times for this competition. To update competition settings, do \`s!compsettings\`.");
	results = await bot.compResults.findOne({ guildID: message.guild.id });
	results = results.events;

	let embed = new Discord.RichEmbed()
		.setTitle("Manage Comp Entries")
		.setColor("RANDOM")
		.setDescription("Usage: s!manage <view, reset, help>")
		.addField("Viewing Submissions", "**s!manage view <event>**\n  View all submissions for the specified event.")
		.addField("Deleting Submissions", "**s!manage <event> <@usermention, ID, or username>**\n  Delete a user's submission in the specified event. This action is irreversible.")
		.addField("Resetting all Submissions", "**s!manage reset**\nThis will delete all submitted times. You will be prompted to make sure you want to complete this action, as it is completely irreversible.")
		.addField("Documentation", "https://scrambler.gitbook.io/docs/comps/manage");

	if(!args[0] || args[0] == "help") {
		return message.channel.send(embed);
	}

	if(args[1]) {
		if(!Object.keys(key).includes(args[1])) {
			Object.keys(aliases).forEach(arr => {
				if(aliases[arr].includes(args[1])) {
					args[1] = arr;
				}
			});
		}
	}

	if(args[0] == "view") {
		if(!args[1]) return message.channel.send("Please choose an event to view. To see available events, do \`s!events\`");
		if(!eventList.includes(args[1])) return message.channel.send(`Please check the spelling of \`${args[1]}\`. To see available events, do \`s!events\``);
		let submissions = {};
		if(results && results[args[1]]) {
			submissions = Object.keys(results[args[1]]);
		} else {
			return message.channel.send(`No results were found in the database for ${args[1]}!`);
		}
		let count = Object.keys(submissions).length;
		if(count > 0) {
			let sEmbed = new Discord.RichEmbed()
				.setTitle(config[key[args[1]]].name)
				.setColor("RANDOM")
				.addField("Number of submissions", submissions.length);
			for(let i = 0; i < submissions.length; i++) {
				let sub = toMinSec(results[args[1]][submissions[i]]);
				let user = bot.users.get(sub.userID);
				sEmbed.addField(user.username, `Result: ${sub.time}\nSubmitted: ${sub.timestamp}`, true);
			}
			return message.channel.send(sEmbed);
		} else {
			return message.channel.send("There are no submissions for this event.");
		}
	} else if(args[0] == "reset") {
		message.channel.send("Are you sure you want to delete all competition entries? This action is irreversible. **Y**/*N*");
		message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000, errors: ["time"] })
			.then(async collected => {
				if(collected.first() && collected.first().content.toLowerCase().startsWith("y")) {
					await bot.compResults.updateOne({ guildID: message.guild.id }, { $unset: { events: {} } });
					return message.channel.send("Okay, all competition results have been deleted.");
				} else {
					return message.channel.send("Action cancelled.");
				}
			});
	} else if(eventList.includes(args[0])) {
		let user = args[1] ? message.mentions.users.first() != null ? message.mentions.users.first() : isID(args[1]) ? message.guild.members.get(args[1]) : findUser(args[1]) != null ? findUser(args[1]) : null : null;
		if(!user) return message.channel.send("Please mention a user, enter their ID, or their username.");
		let username = message.guild.members.get(user.id).displayName;
		if(!results[args[0]][user.id]) return message.channel.send(`This user does not have a time entered for \`${args[0]}\``);
		message.channel.send(`Are you sure you want to delete ${username}'s time in ${args[0]}? **Y**/*N*`);
		message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000, errors: ["time"] })
			.then(async collected => {
				if(collected.first() && collected.first().content.toLowerCase().startsWith("y")) {
					delete results[args[0]][user.id];
					await collected.first().delete();
					await bot.compResults.updateOne({ guildID: message.guild.id }, { $set: { events: results } });
					return message.channel.send(`Okay, I've deleted ${username}'s time from ${args[0]}!`);
				} else {
					return message.channel.send("Action cancelled.");
				}
			});
	}

	// Helper functions
	function isID(string) {
		if(typeof string == "string") {
			if(string.length == 18) {
				if(parseInt(string)) {
					return true;
				}
			}
		}
		return false;
	}

	function findUser(name) {
		return message.guild.members.find("displayName", name);
	}

	function toMinSec(secStr) {
		let flo;
		let min;
		let sec;
		flo = Number.parseFloat(secStr).toFixed(2);
		if(flo > 60) {
			min = Math.floor(flo / 60);
			sec = Number.parseFloat(flo % 60).toFixed(2);
			if(sec < 10) {
				return `${min}:0${sec}`;
			}
			return `${min}:${sec}`;
		}
		sec = Number.parseFloat(secStr).toFixed(2);
		return sec;
	}
};
module.exports.config = { name: "manage", aliases: ["manageresults"] };
