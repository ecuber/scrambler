const Discord = require("discord.js");
const fs = require("fs");
const defSet = { enabled: true, "twox": { name: "**2x2**", enabled: true, count: 5 }, "threex": { name: "**3x3**", enabled: true, count: 5 }, "fourx": { name: "**4x4**", enabled: true, count: 5 }, "fivex": { name: "**5x5**", enabled: true, count: 5 }, "sixx": { name: "**6x6**", enabled: true, count: 3 }, "sevenx": { name: "**7x7**", enabled: true, count: 3 }, "oh": { name: "**OH**", enabled: true, count: 5 }, "clockx": { name: "**Clock**", enabled: true, count: 5 }, "pyrax": { name: "**Pyraminx**", enabled: true, count: 5 }, "megax": { name: "**Megaminx**", enabled: true, count: 5 }, "squanx": { name: "**Square-1**", enabled: true, count: 5 }, "redi": { name: "**Redi Cube**", enabled: false, count: 5 }, "twox3": { name: "**2x2x3**", enabled: false, count: 5 }, "ivy": { name: "**Ivy Cube**", enabled: false, count: 5 } };
const key = { "2x2": "twox", "3x3": "threex", "4x4": "fourx", "5x5": "fivex", "6x6": "sixx", "7x7": "sevenx", "oh": "oh", "clock": "clockx", "pyra": "pyrax", "mega": "megax", "skewb": "skewbx", "squareone": "squanx", "redi": "redi", "2x2x3": "x2x3", "ivy": "ivy" };
const aliases = { "2x2": [], "3x3": [], "4x4": [], "5x5": [], "6x6": [], "7x7": [], "oh": ["onehanded", "onehand", "one-handed", "one-hand"], "clock": [], "pyra": ["pyraminx"], "mega": ["megaminx"], "skewb": ["skoob"], "squareone": ["square-1", "sq1", "squareone", "square1", "square_one", "squan", "sq-1"], "redi": ["redicube", "redi-cube"], "2x2x3": [], "ivy": ["ivy-cube", "ivycube"] };

module.exports.run = async (bot, message, args, cube) => {
	if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
	let guild = await bot.guildData.findOne({ guildID: message.guild.id });
	let justCreated = false;
	if(!guild || !guild.compConfig) {
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: defSet } }, { upsert: 1 });
		justCreated = true;
	}
	guild = await bot.guildData.findOne({ guildID: message.guild.id });

	let config = guild.compConfig;

	if(!args[0] || args[0] == "help" || !["toggle", "event", "events", "reset"].includes(args[0])) {
		let enabled;
		let eventList = [];
		if(config.enabled) {
			// console.log(config);
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
			.setTitle("Competition Configuration")
			.setColor("RANDOM")
			.setDescription("This command configures the events to be included when running `s!comp`. Read the following examples to see how to configure your server competitions! Please note that only users with the **Manage Server** permission are allowed to edit the configuration, and only users with **Manage Messages** are allowed to use `s!comp`")
			.addField("Default Events", "The default events included are the following: 2x2-7x7, one-handed, pyraminx, megaminx, skewb, and square-one. Aditionally, redi cube, 2x2x3, and ivy cube are available, but not part of the default set.")
			.addField("Toggling Comps", "Competition scrambles are enabled by default, but can be toggled on or off via `s!compconfig toggle`. If you are unsure of whether competitions are toggled on or off, check the bottom of this embed.")
			.addField("Toggling Events", "To enable or disable events, simply type `s!compconfig event redi 7x7 ivy`. Replace those three events with any number of events you would like to toggle. If the event you list is enabled, it will be disabled, and vice versa.")
			.addField("Resetting Settings", "To reset all competition settings, do `s!compconfig reset`.")
			.addField("Documentation", "https://scrambler.gitbook.io/docs/comps/configuration")
			.addField("Your Settings", `Competition scrambles are ***${enabled}***`, true);
		if(eventList.length > 0) {
			embed.addField("Enabled Events", `• ${eventList.join("\n• ")}`);
		}
		return message.channel.send(embed);
	}

	if(args[0] == "toggle") {
		if(!config.enabled || justCreated) {
			config.enabled = true;
			await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: config } });
			return message.channel.send("Okay, \`s!comps\` and \`s!submit \` have been `enabled`. To disable, simply run this command again.");
		} else {
			config.enabled = false;
			await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: config } });
			return message.channel.send("Okay, \`s!comps\` and \`s!submit \` have been `disabled`. To reenable, simply run this command again.");
		}
	}
	if(args[0] == "reset") {
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: defSet } });
		return message.channel.send("Okay, I have reset all events to their default settings.");
	}

	if(!config.enabled) return message.channel.send("\`s!comps\` is currently disabled. To re-enable, please run \`s!config toggle\`");
	if(args[0] == "event" || args[0] == "events") {
		if(!args[1]) return message.channel.send("Please list at least one event to toggle. To see the list of event names, please see `s!events`");
		args[1] = args[1].toLowerCase();
		if(!Object.keys(key).includes(args[1])) {
			Object.keys(aliases).forEach(arr => {
				if(aliases[arr].includes(args[1])) {
					args[1] = arr;
				}
			});
		}
		let selectedNames = [];
		let selected = [];
		let unknown = [];
		// console.log(config);
		if(args[1] == "reset") {
			await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: defSet } });
			return message.channel.send("Okay, I have reset all events to their default settings.");
		}

		for(let i = 1; i < args.length; i++) {
			if(Object.keys(key).includes(args[i])) {
				selectedNames.push(args[i]);
				selected.push(key[args[i]]);
			} else {
				unknown.push(args[i]);
			}
		}
		// console.log(`selected: ${selected}`);
		// console.log(`unknown: ${unknown}`);
		selected.forEach(async event => {
			// console.log(event);
			// console.log(config[event]);
			if(config[event].enabled) {
				config[event].enabled = false;
			} else {
				config[event].enabled = true;
			}
		});
		await bot.guildData.updateOne({ guildID: message.guild.id }, { $set: { compConfig: config } });

		if(selected.length && !unknown.length) return message.channel.send(`Okay, the following events have been toggled: \`${selectedNames.join(", ")}\``);
		if(selected.length && unknown.length) return message.channel.send(`Okay, the following events have been toggled: \`${selectedNames.join(", ")}\`, however there were ${unknown.length} invalid arguments: ${unknown.join(", ")}. You can see the correct spellings by doing \`s!events\``);
		if(!selected.length && unknown.length) return message.channel.send(`None of the events you specified were valid. Please make sure you spelled them correctly, and make sure they are currently available for \`s!comps\`. You can see which events are available by doing \`s!events\``);
	}
};
module.exports.config = { name: "compconfig", aliases: ["config", "compsettings"] };
