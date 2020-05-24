const { Command, util: { isFunction } } = require("klasa");
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["commands"],
            runIn: ["text"],
            cooldown: 5,
            cooldownLevel: "channel",
            description: language => language.get("COMMAND_HELP_DESCRIPTION"),
            usage: "(Command:command)"
        });

        this.createCustomResolver("command", (arg, possible, message) => {
            if (!arg || arg === "") return undefined;
            return this.client.arguments.get("command").run(arg, possible, message);
        });
    }

    async run(message, [command]) {
        if (command) {
            const info = new MessageEmbed()
                .setTitle(command.name)
                .setColor("RANDOM")
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL())
                .setTimestamp()
                .addField(`**Description:**`, `${isFunction(command.description) ? command.description(message.language) : command.description}`)
                .addField("**Usage**", command.usage.fullUsage(message))
                .addField("Extended Help", isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp);

            return message.sendMessage(info);
        }
        const help = await this.buildHelp(message);

        let keys = Object.keys(help);

        let helpMessage = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("**Comands**")
            .setDescription("For more information on any command, use *s!help <command name>*. If you need more help operating the bot, join our support server linked **[here](https://discord.gg/bzKHzXc)**.")
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL())
            .setTimestamp()
            .addField("Documentation", "**Every scrambler command has detailed documentation available [here!](https://docs.scramblr.app/docs/)** If you're new to the bot, it is highly recommended that you take a look at this site.")
            .setTimestamp();

        let admin = RegExp(/\badmin\b/gi).test(keys[0]);
        if (admin) {
            delete help.Admin;
        }

        helpMessage.setTitle(`**Commands**:`);

        keys = Object.keys(help);
        keys.sort(); // alphabetizes categories (general, scramble generators, settings)

        for (let i = 0; i < keys.length; i++) helpMessage.addField(`${keys[i]}`, help[keys[i]][Object.keys(help[keys[i]])].join("\n"));

        return message.sendMessage(helpMessage);
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
