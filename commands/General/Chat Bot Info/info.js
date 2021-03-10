const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const formatMili = (miliseconds) => {
    let days, hours, minutes, totalHours, totalMinutes, totalSeconds;

    totalSeconds = parseInt(Math.floor(miliseconds / 1000));
    totalMinutes = parseInt(Math.floor(totalSeconds / 60));
    totalHours = parseInt(Math.floor(totalMinutes / 60));
    days = parseInt(Math.floor(totalHours / 24));
    minutes = parseInt(totalMinutes % 60);
    hours = parseInt(totalHours % 24);
    return `${days} days, ${hours} hours, ${minutes} minutes`;
};
module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["about", "support"],
            guarded: true,
            description: language => language.get("COMMAND_INFO_DESCRIPTION")
        });
    }

    async run(message) {
        const bot = this.client;
        let embed = new MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setColor("RANDOM")
            .addField("Language", "Node.js", true)
            .addField("Library", "Klasa", true)
            .addField("Ping", `${Math.floor(bot.ws.ping)}ms`, true)
            .addField("Invite Bot", "[Invite Here!](https://discordapp.com/api/oauth2/authorize?client_id=423530119836073986&permissions=67111936&scope=bot)", true)
            .addField("Support Server", "[Join Here!](https://discord.gg/bzKHzXc)", true)
            .addField("GitHub Repository", "[Check it out!](https://github.com/ecuber/scrambler)", true)
            .addField("Documentation", "[Click here!](https://docs.scramblr.app/docs)")
            .addField("Guilds", bot.guilds.cache.size, true)
            .addField("Human Users", bot.users.cache.filter((usr) => !usr.bot).size, true)
            .addField("Uptime", `${formatMili(bot.uptime)}`, true)
            .addField("Creators", "**ecuber#0566** & **Bacon#1153**")
            .addField("Created", bot.user.createdAt)
            .addField("About", "Scrambler is a Discord bot that generates scrambles for a variety of twisty puzzles. Originally written by ecuber, revised by Bacon, then rewritten by ecuber.")
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
