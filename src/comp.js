const scrambles = require("../relay.js");
const redi = require("../rediremote");
const Discord = require("discord.js");
const fs = require("fs");
const defSet = {
	enabled: true,
	"twox": { name: "**2x2**", enabled: true, count: 5 },
	"threex": { name: "**3x3**", enabled: true, count: 5 },
	"fourx": { name: "**4x4**", enabled: true, count: 5 },
	"fivex": { name: "**5x5**", enabled: true, count: 5 },
	"sixx": { name: "**6x6**", enabled: true, count: 3 },
	"sevenx": { name: "**7x7**", enabled: true, count: 3 },
	"oh": { name: "**OH**", enabled: true, count: 5 },
	"clockx": { name: "**Clock**", enabled: true, count: 5 },
	"pyrax": { name: "**Pyraminx**", enabled: true, count: 5 },
	"megax": { name: "**Megaminx**", enabled: true, count: 5 },
	"skewbx": { name: "**Skewb**", enabled: true, count: 5 },
	"squanx": { name: "**Square-1**", enabled: true, count: 5 },
	"redi": { name: "**Redi Cube**", enabled: false, count: 5 },
	"twox3": { name: "**2x2x3**", enabled: false, count: 5 },
	"ivy": { name: "**Ivy Cube**", enabled: false, count: 5 }
};

module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do no have permission to use this command. Missing permission: `MANAGE_MESSAGES`").then(msg => msg.delete(7000));
	let guild = await bot.guildData.findOne({ guildID: message.guild.id });
	if(!guild || !guild.compConfig) await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: defSet } }, { upsert: 1 });
	guild = await bot.guildData.findOne({ guildID: message.guild.id });
	let config = guild.compConfig;

	if(!config.enabled) return message.channel.send("This command is not currently enabled. To enable it, please enter \`s!config toggle\`.");
	if(args[0] == "help") {
		let enabled;
		let eventList = [];
		if(config.enabled) {
			enabled = "enabled";
			let keys = Object.keys(config);
			for(let i = 1; i < keys.length; i++) {
				if(config[keys[i]].enabled) {
					let eventName = config[keys[i]].name.replace(/\*/gi, "");
					eventList.push(eventName);
				}
			}
		} else {
			enabled = "disabled";
		}
		let embed = new Discord.RichEmbed()
			.setTitle("Comp Scramble Configuration")
			.setColor("RANDOM")
			.setDescription("This command configures the events to be included when running `s!comp`. Read the following examples to see how to configure your server competitions! Please note that only users with the **Manage Server** permission are allowed to edit the configuration, and only users with **Manage Messages** are allowed to use `s!comp`")
			.addField("Default Events", "The default events included are the following: 2x2-7x7, one-handed, pyraminx, megaminx, skewb, and square-one. Aditionally, redi cube, 2x2x3, and ivy cube are available, but not part of the default set.")
			.addField("Toggling Comps", "Competition scrambles are enabled by default, but can be toggled on or off via `s!compconfig toggle`. If you are unsure of whether competitions are toggled on or off, check the bottom of this embed.")
			.addField("Toggling Events", "To enable or disable events, simply type `s!compconfig event redi 7x7 ivy`. Replace those three events with any number events you would like to toggle. If the event you list is enabled, it will be disabled, and vice versa.")
			.addField("Documentation", "Read more detailed documentation on this command here: https://scrambler.gitbook.io/docs/comps/comp")
			.addField("Your Settings", `Competition scrambles are ***${enabled}***`, true);
		if(eventList.length > 0) {
			embed.addField("Enabled Events", `• ${eventList.join("\n• ")}`);
		}
		return message.channel.send(embed);
	}
	let events = Object.keys(config);

	let msgArr = [];

	for(let i = 1; i < events.length; i++) {
		let event = config[events[i]];
		let name = events[i];
		if(name == "oh") {
			name = "threex";
		} else if(name == "ivy") {
			name = "skewbx";
		}
		if(event.enabled) {
			let str = [`${event.name}\`\`\``];
			for(let j = 0; j < event.count; j++) {
				if(name == "redi") {
					str.push(`${j + 1}: ${redi.generate_scramble_sequence()}`);
				} else {
					str.push(`${j + 1}: ${eval(`scrambles["${name}"]()`)}`);
				}
			}
			str.push("\`\`\`");
			msgArr.push(str.join("\n\n"));
		}
	}
	msgArr.forEach(event => {
		setTimeout(() => {
			message.channel.send(event);
		}, 1500);
	});
	setTimeout(() => message.channel.send("Competition scrambles complete.").then(msg => msg.delete(10000)), 12500);
};
module.exports.config = { name: "comp", aliases: ["comps", "compscrambles"] };
