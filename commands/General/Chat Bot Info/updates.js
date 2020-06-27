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
            .setTitle("Bug Fixes!")
            .setColor("RANDOM")
            .setDescription("Recently, many issues have come up surrounding competitions (podiums, submissions). **Now, all issues with competitions should be fixed.** The issue stemmed from some servers being on older competition data structures I never considered having to migrate.")
            .addField("What now?", "For roughly 90% of servers, all you have to do is start a new competition like normal! Your configuration has been saved and commands should work as you would expect.")
            .addField("I'm still having issues.", "If you're still having issues or have other questions, **please join the scrambler support server [here!](http://discord.gg/KHCFQX7) ** I can reset your server manually and answer any other questions you may have. Thanks for using scrambler!")
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
