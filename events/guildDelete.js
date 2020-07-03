const { Event } = require("klasa");
const { guildLog } = require("../settings.json");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Event {
    run(guild) {
        if (this.client.ready && guild.available && !this.client.options.preserveSettings) guild.settings.destroy().catch(() => null);
        console.log(`Left guild ${guild.name} [${guild.id}]`);
        this.client.channels.cache.get(guildLog).send(
            new MessageEmbed()
                .setColor("#d1646d")
                .setThumbnail(guild.iconURL())
                .setTitle("Left Guild:")
                .addField("Name", `**${guild.name}** [ID: ${guild.id}]`)
                .addField("Owner", `**${guild.owner.user.username}#${guild.owner.user.discriminator}** [ID: ${guild.owner.id}]`)
                .addField("Member Count", `${guild.memberCount}`)
                .setTimestamp());
        this.client.user.setActivity(`it's finally fixed | Scrambling cubes for ${this.client.guilds.cache.size} servers!`);
    }
};
