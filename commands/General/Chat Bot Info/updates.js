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
            .setDescription("Welcome to Scrambler v2.0.0! This is the long-awaited new and improved version of the bot you know and love. Click on a feature to see documentation on the command or click **[here](https://docs.scramblr.app/docs)** to read the docs from the beginning.", true)
            .addField("Technical Changes", "Scrambler was originally written using the discord.js library in 2018. Scrambler 2 has been transitioned to the Klasa library and is even faster and more efficient than ever before. In addition, scrambler's scramble generators have been packaged in a new [npm module](https://github.com/ecuber/scrambler-util), `scrambler-util`.", true)
            .addField("Additions", "+ [Added FMC and BLD scrambles](https://docs.scramblr.app/docs/scramblers/args)\n+ Help command takes advantage of Klasa to update itself dynamically as new commands are added.\n+ Variable cooldown depending on puzzle size added to all scramble commands to reduce spam.")
            .addField("Changes", "~ Competitions have seen a complete revamp! [Click here to see all the changes.](https://docs.scramblr.app/docs/comps/comp) Notable changes include comp moderators, banning users/roles, and customizable solve count.\n ~ [Submissions are now verbose](https://docs.scramblr.app/docs/comps/submit). Old style submissions may return soon, but this solves the issue of potential ties.", true)
            .addField("Unreleased", "- Old style submission option\n- Web dashboard", true)
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
