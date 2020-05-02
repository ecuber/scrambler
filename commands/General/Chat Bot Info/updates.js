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
            .setDescription("Welcome to Scrambler v2.0.0! This is the long-awaited new and improved version of the bot you know and love. Read on to see all of the new features and changes made in this version of Scrambler!", true)
            .addField("Klasa", "Scrambler was originally written using the discord.js library in 2018. While d.js is great, there's simply a better option out there. Scrambler 2 is written using the Klasa library and is even faster and more efficient than ever before. This doesn't mean much for the users, but the code behind the scenes is far more clean and easy to work with, so updates may be even more frequent.", true)
            .addField("Additions", "+ 2x2-5x5 scramblers now have an optional **“bld”** argument for blindfolded solving. This will add rotations or wide moves to change the orientation. *(e.g. s!4x4 bld 3)*\n+ Added **FMC scrambles** for 3x3 to pad scramble with R\' U\' F *(e.g. s!3x3 fmc 3)*\n+ Updated aesthetics when requesting multiple scrambles. Now, scrambles are numbered and double-spaced.\n+ Help command takes advantage of Klasa to update itself dynamically as new commands are added. Admin commands are now sent in a DM.\n+ Variable cooldown depending on puzzle size added to all scramble commands to reduce spam.")
            .addField("Changes", "~ Updated redi cube to be far more efficient with a custom scrambler. Uses updated “Moyu” notation (thanks P4yin#9177!)\n~ Custom prefixes and channel restrictions take advantage of Klasa's built in storage system in conjunction with MongoDB.", true)
            .addField("Unreleased", "- Competitions and relays will not be available for the time being. These features are built around high quantities of scrambles being sent all at once, and with our current system would be very tedious and inefficient to code. For that reason, they will be added again once Bacon’s scrambled-eggs module is complete to streamline the code and maximize efficiency.", true)
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
