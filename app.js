const Discord = require("discord.js");
const bot = new Discord.Client();
const Scrambo = require("scrambo");
const cube = new Scrambo();
const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.settings = require("./settings.json");
bot.prefixes = require("./prefixes.json");

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
	await bot.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | !help`);

	const snekfetch = require("snekfetch");
	const key = bot.settings.DBLkey

	snekfetch.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
		.set("Authorization", key)
		.send({ server_count: bot.guilds.size })
		.then(() => console.log(`Stats posted to DBL.`))
		.catch((error) => console.error(error));
});

bot.on("guildCreate", async guild => {
	await bot.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | !help`);
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
	await bot.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | !help`);
	let guildLog = bot.channels.find("id", "455088142475591691");
	let leaveEmbed = new Discord.RichEmbed()
		.setColor("#fc102c")
		.setThumbnail(guild.iconURL)
		.setTitle("Left Guild:")
		.addField("Name", `**${guild.name}** [ID: ${guild.id}]`)
		.addField("Owner", `**${guild.owner.user.username}#${guild.owner.user.discriminator}** [ID: ${guild.owner.id}]`)
		.setTimestamp();
	console.log(`Left guild: ${guild.name}, ID: ${guild.id}`);
	guildLog.send(leaveEmbed);
});

bot.on("disconnect", () => console.log("Disconnected! Reconnecting..."));

bot.on("reconnecting", () => console.log("Reconnected!"));

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type !== "text") return message.channel.send("I don't like DM channels, please use a text channel on a server!").then(msg => msg.delete(2400));

	let prefix;
	if(bot.prefixes[message.guild.id]) {
		prefix = bot.prefixes[message.guild.id].prefix;
	} else {
		prefix = bot.settings.prefix;
	}

	let messageArr = message.content.split(/\s+/g);
	let command = messageArr[0].toLowerCase();
	let args = messageArr.slice(1);

	if(!command.startsWith(prefix)) return;
	let cmd;
	if(bot.commands.get(command.slice(prefix.length))) {
		cmd = bot.commands.get(command.slice(prefix.length));
	} else {
		cmd = bot.aliases.get(command.slice(prefix.length));
	}
	if(cmd) {
		try {
			await cmd.run(bot, message, args, cube);
		} catch(error) {
			console.log(error.stack);
			return message.channel.send(`:x: Error:\n\`\`\`\n${error.stack}\n\`\`\`\nPlease report this to ecuber#0566, Bacon#1153 or in the official Scrambler Discord server (!info for invite).`);
		}
	}
});
process.on("unhandledRejection", error => {
	console.error(`Uncaught Promise Error: \n${error.stack}`);
});

bot.login(bot.settings.token);
