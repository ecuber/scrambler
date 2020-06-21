const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "updates",
            aliases: ["changelog", "update"],
            guarded: true,
            description: "Information about the latest and upcoming updates to Scrambler!"
        });
    }

    async run(message) {
        const bot = this.client;
        let embed = new MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setColor("RANDOM")
            .setDescription("Welcome to Scrambler v2.0.3! This is the long-awaited new and improved version of the bot you know and love. Click on a feature to see documentation on the command or click **[here](https://docs.scramblr.app/docs)** to read the docs from the beginning.", true)
            .addField("Technical Changes", "Scrambler was originally written using the discord.js library in 2018. Scrambler 2 has been transitioned to the Klasa library and is even faster and more efficient than ever before. In addition, scrambler's scramble generators have been packaged in a new [npm module](https://github.com/ecuber/scrambler-util), `scrambler-util`.", true)
            .addField("Additions", "+ [Added FMC and BLD scrambles](https://docs.scramblr.app/docs/scramblers/args)\n+ Help command takes advantage of Klasa to update itself dynamically as new commands are added.\n+ Variable cooldown depending on puzzle size added to all scramble commands to reduce spam.")
            .addField("Changes", "~ Competitions have seen a complete revamp! [Click here to see all the changes.](https://docs.scramblr.app/docs/comps/comp) Notable changes include [comp moderators](https://docs.scramblr.app/docs/util/config#scrambler-moderators), [banning users/roles](https://docs.scramblr.app/docs/util/config#banning-users-roles), and [customizable solve count](https://docs.scramblr.app/docs/util/config#setting-up-events).\n ~ [Submissions are now verbose by default](https://docs.scramblr.app/docs/comps/submit), meaning you have to submit all of your times in the average. If you want to [revert to classic submissions](https://docs.scramblr.app/docs/util/config#picking-a-submission-style), you may do so.")
            .addField("Bug Fixes", "~ Fixed podiums not sending properly/not at all.")
            .addField("Unreleased", "- Web dashboard/competition system")
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
