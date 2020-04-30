const { Command, util: { isFunction } } = require('klasa');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const Discord = require("discord.js");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['commands'],
			runIn: ["text"],
			cooldown: 10,
			cooldownLevel: "channel",
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	async run(message, [command]) {
		if (command) {
			const info = new Discord.MessageEmbed()
				.setTitle(command.name)
				.setColor("RANDOM")
				.setFooter(this.client.user.username, this.client.user.displayAvatarURL())
				.setTimestamp()
				.addField(`**Description:**`, `${isFunction(command.description) ? command.description(message.language) : command.description}`)
				.addField("**Usage**", command.usage.fullUsage(message))
				.addField("Extended Help", isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp)
				
			return message.sendMessage(info);
		}
		const help = await this.buildHelp(message);
		
		let keys = Object.keys(help);

		let helpMessage = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("**Comands**")
			.setDescription("For more information on any command, use *s!help <command name>*")
			.setFooter(this.client.user.username, this.client.user.displayAvatarURL())
			.setTimestamp();

		let adminHelp = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("**Admin Commands**")
			.setDescription("For more information on any command, use *s!help <command name>*")
			.setFooter(this.client.user.username, this.client.user.displayAvatarURL())
			.setTimestamp();

		let admin = RegExp(/\badmin\b/gi).test(keys[0]);
		if (admin) {
			const subCategories = Object.keys(help[keys[0]]); // help.Admin keys     General						
			for (let subCat = 0; subCat < subCategories.length; subCat++) adminHelp.addField(`${subCategories[subCat]}`, `${help[keys[0]][subCategories[subCat]].join('\n')}\n`);
			
		}

		helpMessage.setTitle(`**Commands**:`);
		if (admin) {
			delete help.Admin;
		}
		keys = Object.keys(help);
		for (let i = 0; i < keys.length; i++) helpMessage.addField(`${keys[i]}`, help[keys[i]][Object.keys(help[keys[i]])].join("\n"));

		message.sendMessage(helpMessage);
		return admin ? message.author.sendMessage(adminHelp) : null;
		
	}

	async buildHelp(message) {
		const help = {};

		const { prefix } = message.guildSettings;
		const commandNames = [...this.client.commands.keys()];
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					if (!has(help, command.category)) help[command.category] = {};
					if (!has(help[command.category], command.subCategory)) help[command.category][command.subCategory] = [];
					const description = isFunction(command.description) ? command.description(message.language) : command.description;
					help[command.category][command.subCategory].push(`${prefix}${command.name.padEnd(longest)} : ${description}`);
				})
				.catch(() => {
					// noop
				})
		));

		return help;
	}

};
