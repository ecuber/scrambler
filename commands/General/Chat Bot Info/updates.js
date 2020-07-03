const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "updates",
            aliases: ["changelog", "update", "bugs"],
            guarded: true,
            description: "Information about the latest and upcoming updates to Scrambler!"
        });
    }

    async run(message) {
        const bot = this.client;
        let embed = new MessageEmbed()
            .setTitle("Submission Bugs")
            .setColor("RANDOM")
            .setDescription("Due to problems with Klasa's Settings Gateway the submit command is not functional. I reached out to the Klasa developers and they told me I'll have to rewrite much of the bot that is affected by the issue fixed in a new version of Klasa that is not backwards compatible with my code. I would estimate in the next 2-3 days I'll have updated the code to the new version, and hopefully everything should be fixed. I'll do my best to leave your server settings and comp results untouched but I may have to reset them so the bot has a clean slate to work with. Sorry the bot's relaunch has been so shaky, I'm just doing my best to roll with the punches and use the latest technologies for you guys!\n\nlmk if u have questions on the [support server](https://discord.gg/vdxGtKK)!\n-ecuber#0566 (developer)")
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
