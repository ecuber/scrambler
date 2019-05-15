const key = { "2x2": "twox", "3x3": "threex", "4x4": "fourx", "5x5": "fivex", "6x6": "sixx", "7x7": "sevenx", "oh": "oh", "clock": "clockx", "pyra": "pyrax", "mega": "megax", "skewb": "skewbx", "squareone": "squanx", "redi": "redi", "2x2x3": "x2x3", "ivy": "ivy" };

module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do no have permission to use this command. Missing permission: `MANAGE_MESSAGES`").then(msg => msg.delete(7000));
	let guild = await bot.guildData.findOne({ guildID: message.guild.id });
	if(!guild || !guild.compConfig) return message.channel.send("Competitions are not yet enabled on this server. To enable them, have someone with the Manage Server permission do \`s!config toggle\`");
	let config = guild.compConfig;

	let results = await bot.compResults.findOne({ guildID: message.guild.id });
	if(!results || !results.events) return message.channel.send("No results found in the database for the current competition.");
	results = results.events;

	let channel = args[0] ? message.mentions.channels.first() ? message.mentions.channels.first() : getChannel(args[0]) ? getChannel(args[0]) : null : message.channel;
	if(channel != null && channel != undefined) {
		message.channel.send(`Are you sure you want to post podiums for this competition in \`#${channel.name}\`? Doing so will also delete all results for this competition cycle. **Y**/*N*`).then(msg => msg.delete(10000));
	} else {
		return message.channel.send(`Unable to find channel \`#${args[0]}\`.`);
	}
	await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 10000, errors: ["time"] })
		.then(async collected => {
			if(collected.first() && collected.first().content.toLowerCase().startsWith("y")) {
				postPodiums();
			} else {
				return message.channel.send("Action cancelled.");
			}
		});

	async function postPodiums() {
		let podiums = [];

		let entries;
		let podium;
		let event;

		for(let ev in results) {
			event = results[ev];
			entries = [];
			podium = [];
			if(config[key[ev]] && config[key[ev]].enabled) {
				let keys = Object.keys(event);
				for(let i = 0; i < keys.length; i++) entries.push(event[keys[i]]);

				entries.sort((a, b) => a.time - b.time);
			}
			if(entries[0]) {
				podium[0] = `${config[key[ev]].name} **Podium**\n`;
				if(!entries[0].dnf) {
					podium[1] = `**1st Place:** <@${entries[0].userID}> with a result of ${toMinSec(entries[0].time)}`;
				} else {
					podium[1] = `**1st Place:** <@${entries[0].userID}> with a result of DNF`;
				}
				if(entries[1]) {
					if(!entries[1].dnf) {
						podium[2] = `**2nd Place:** <@${entries[1].userID}> with a result of ${toMinSec(entries[1].time)}`;
					} else {
						podium[2] = `**2nd Place:** <@${entries[1].userID}> with a result of DNF`;
					}
					if(entries[2]) {
						if(!entries[2].dnf) {
							podium[3] = `**3rd Place:** <@${entries[2].userID}> with a result of ${toMinSec(entries[2].time)}`;
						} else {
							podium[3] = `**3rd Place:** <@${entries[2].userID}> with a result of DNF`;
						}
					}
				}
			}
			if(podium) podiums.push(podium.join("\n"));
		}
		let error = false;
		if(podiums.length > 0) {
			for(let i = 0; i < podiums.length; i++) {
				if(podiums[i]) {
					await channel.send(podiums[i])
						// eslint-disable-next-line arrow-body-style
						.catch(_err => {
							error = true;
							return message.channel.send(`Unable to send a message to \`#${channel.name}\`. Please make sure Scrambler has permission to send messages in this channel.`);
						});
				}
			}
			if(!error) {
				await bot.compResults.updateOne({ guildID: message.guild.id }, { $unset: { events: {} } });
				return message.channel.send("Okay, all competition podiums have been posted and results have been deleted from the database.").then(msg => msg.delete(7000));
			}
		} else {
			return message.channel.send("No results to post.").then(msg => msg.delete(7000));
		}
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

	function getChannel(name) {
		if(isID(name)) {
			return message.guild.channels.get(name);
		} else {
			if(message.guild.channels.find(cha => cha.name === name)) {
				return message.guild.channels.find(cha => cha.name === name);
			}
		}
		return null;
	}
};
module.exports.config = { name: "podium", aliases: ["getpodium", "podiums"] };
