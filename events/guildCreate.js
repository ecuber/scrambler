const { Event } = require("klasa");
const { guildLog } = require("../settings.json");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Event {
    run(guild) {
        if (!guild.available) return;
        if (this.client.settings.guildBlacklist.includes(guild.id)) {
            guild.leave();
            this.client.emit("warn", `Blacklisted guild detected: ${guild.name} [${guild.id}]`);
        }
        console.log(`Joined guild: ${guild.name} [${guild.id}]`);
        this.client.channels.cache.get(guildLog).send(
            new MessageEmbed()
                .setColor("#64d175")
                .setThumbnail(guild.iconURL())
                .setTitle("Joined Guild:")
                .addField("Name", `**${guild.name}** [ID: ${guild.id}]`)
                .addField("Owner", `**${guild.owner.user.username}#${guild.owner.user.discriminator}** [ID: ${guild.owner.user.id}]`)
                .addField("Member Count", `${guild.memberCount}`)
                .setTimestamp());
        this.client.user.setActivity(`Scrambling cubes for ${this.client.guilds.cache.size} servers!`);
    }
};
