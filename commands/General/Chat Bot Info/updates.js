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
        let embed = new MessageEmbed()
            .setTitle("Submit Bugs are resolved!")
            .setColor("RANDOM")
            .setDescription("The submit bug is finally fixed! Lots of technical issues came up but the solution ended up being quite simple.")
            .addField("What now?", "The issue should be completely resolved and your settings should be untouched. If you have *any* questions, please ask them on the **[support server](https://discord.gg/vdxGtKK)**! Thanks for sticking around and using scrambler.\n-ecuber#0566 (developer)")
            .setTimestamp()
            .setFooter(`Scrambler`, this.client.user.displayAvatarURL());

        message.send(embed);
    }
};
