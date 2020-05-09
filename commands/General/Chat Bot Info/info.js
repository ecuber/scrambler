const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const formatMili = (miliseconds) => {
    let days, hours, minutes, total_hours, total_minutes, total_seconds;

    total_seconds = parseInt(Math.floor(miliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));
    minutes = parseInt(total_minutes % 60);
    hours = parseInt(total_hours % 24);
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
            .addField("Documentation", "[Click here to read the docs! (Outdated)](https://scrambler.gitbook.io/docs/)")
            .addField("Guilds", bot.guilds.cache.size, true)
            .addField("Human Users", bot.users.cache.filter((usr) => !usr.bot).size, true)
            .addField("Uptime", `${formatMili(bot.uptime)}`, true)
            .addField("Creators", "**ecuber#0566** & **Bacon#1153**")
            .addField("Created", bot.user.createdAt)
            .addField("About", "Scrambler is a Discord bot that generates scrambles for a variety of twisty puzzles. The bot was originally written by ecuber in discord.js in early 2018 and rewritten by Bacon later that year. In early 2020, ecuber rewrote scrambler from the ground up in Klasa using Bacon's custom new scramble generation module, scrambled-eggs.")
            .setTimestamp()
            .setFooter(`Scrambler`, bot.user.displayAvatarURL());

        message.send(embed);
    }
};
