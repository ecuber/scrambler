const Discord = require("discord.js");
const bot = new Discord.Client();
const Scrambo = require("scrambo");
const cube = new Scrambo();
const fs = require("fs");
const talkedRecently = new Set();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.settings = require("./settings.json");
bot.guildSettings = require("./guildSettings.json");

fs.readdir("./src/", (err, files) => {
	if(err) console.error(err);

	let jsfiles = files.filter(fi => fi.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}
	jsfiles.map((fi, i) => {
		let props = require(`./src/${fi}`);
		console.log(`${i + 1}: ${fi} loaded!`);
		bot.commands.set(props.config.name, props);
		return props.config.aliases.map(a => bot.aliases.set(a, props));
	});
});

bot.on("warn", console.warn);

bot.on("error", console.error);

bot.on("ready", async () => {
	console.log(`All commands loaded! Scrambler is ready to go!`);
	await bot.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | s!help`);

	const snekfetch = require("snekfetch");

	snekfetch.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
		.set("Authorization", bot.settings.DBLKey)
		.send({ server_count: bot.guilds.size })
		.then(() => console.log(`Stats posted to DBL.`))
		.catch((error) => console.error(error));
});

bot.on("guildCreate", async guild => {
	await bot.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | s!help`);
	let guildLog = bot.channels.find("id", "455088142475591691");
	let joinEmbed = new Discord.RichEmbed()
		.setColor("#11fc30")
		.setThumbnail(guild.iconURL)
		.setTitle("Joined Guild:")
		.addField("Name", `**${guild.name}** [ID: ${guild.id}]`)
		.addField("Owner", `**${guild.owner.user.username}#${guild.owner.user.discriminator}** [ID: ${guild.owner.id}]`)
		.addField("Member Count", `${guild.members.size}`)
		.setTimestamp();
	console.log(`Guild Joined: ${guild.name}, ID: ${guild.id}`);
	guildLog.send(joinEmbed);
});

bot.on("guildDelete", async guild => {
	await bot.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | s!help`);
	let guildLog = bot.channels.find("id", "455088142475591691");
	let leaveEmbed = new Discord.RichEmbed()
		.setColor("#fc102c")
		.setThumbnail(guild.iconURL)
		.setTitle("Left Guild:")
		.addField("Name", `**${guild.name}** [ID: ${guild.id}]`)
		.addField("Owner", `**${guild.owner.user.username}#${guild.owner.user.discriminator}** [ID: ${guild.owner.id}]`)
		.addField("Member Count", `${guild.members.size}`)
		.setTimestamp();
	console.log(`Left guild: ${guild.name}, ID: ${guild.id}`);
	guildLog.send(leaveEmbed);
});

bot.on("disconnect", () => console.log("Disconnected! Reconnecting..."));

bot.on("reconnecting", () => console.log("Reconnected!"));

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type !== "text") return;
	let messageArr = message.content.split(/\s+/g);

	let prefix1;
	if(!bot.guildSettings[message.guild.id]) {
		bot.guildSettings[message.guild.id] = { ignoredChannels: [] };
	}
	await fs.writeFile("./guildSettings.json", JSON.stringify(bot.guildSettings, null, 4, err => {
		if(err) throw err;
	}));
	if(bot.guildSettings[message.guild.id].prefix) {
		prefix1 = bot.guildSettings[message.guild.id].prefix;
	}
	let prefix2 = bot.settings.prefix;
	let prefix3 = message.guild.me.nickname ? `<@!${bot.user.id}>` : `<@${bot.user.id}>`;

	messageArr[0] = messageArr[0].toLowerCase();
	if(prefix1 === messageArr[0] || prefix2 === messageArr[0] || prefix3 === messageArr[0]) {
		messageArr[0] += messageArr[1];
		messageArr.splice(1, 1);
	}
	let command = messageArr[0];
	let args = messageArr.slice(1);
	let prefix;
	if(command.startsWith(prefix1)) {
		prefix = prefix1;
	} else if(command.startsWith(prefix2)) {
		prefix = prefix2;
	} else if(command.startsWith(prefix3)) {
		prefix = prefix3;
	} else {
		return;
	}
	if(!command.startsWith(prefix)) return;

	let cmd;
	if(prefix && bot.commands.get(command.slice(prefix.length))) {
		cmd = bot.commands.get(command.slice(prefix.length));
	} else {
		cmd = bot.aliases.get(command.slice(prefix.length));
	}
	if(cmd) {
		if(!bot.guildSettings[message.guild.id]) {
			bot.guildSettings[message.guild.id] = { ignoredChannels: [] };
		}
		if(cmd === bot.commands.get("restrict")) {
			if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You do not have permission to use this command.");
			try {
				await cmd.run(bot, message, args, cube);
			} catch(error) {
				console.log(error.stack);
				return message.channel.send(`:x: Error:\n\`\`\`\n${error.stack}\n\`\`\`\nPlease report this to Bacon#1153, ecuber#0566, or in the official Scrambler Discord server. Do \`s!info\` for a link.`);
			}
			return;
		}
		if(bot.guildSettings[message.guild.id].ignoredChannels.includes(message.channel.id)) return;
		if(talkedRecently.has(message.author.id)) return;
		talkedRecently.add(message.author.id);
		setTimeout(() => {
			talkedRecently.delete(message.author.id);
		}, 3000);

		if(cmd) {
			try {
				await cmd.run(bot, message, args, cube);
			} catch(error) {
				console.log(error.stack);
				return message.channel.send(`:x: Error:\n\`\`\`\n${error.stack}\n\`\`\`\nPlease report this to Bacon#1153, ecuber#0566, or in the official Scrambler Discord server. Do \`s!info\` for a link.`);
			}
		}
	}
});
process.on("unhandledRejection", error => {
	console.error(`Uncaught Promise Error: \n${error.stack}`);
});

bot.login(bot.settings.token);
