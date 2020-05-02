const { Event } = require("klasa");

module.exports = class extends Event {
    run(guild) {
        if (this.client.ready && guild.available && !this.client.options.preserveSettings) guild.settings.destroy().catch(() => null);
        console.log(`Left guild ${guild.name} [${guild.id}]`);
        this.client.user.setActivity(`s!updates | Scrambling cubes for ${bot.guilds.size} servers!`);
    }
};
