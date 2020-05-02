const { Event } = require('klasa');


module.exports = class extends Event {
	
	run(guild) {
		if (!guild.available) return;
		if (this.client.settings.guildBlacklist.includes(guild.id)) {
			guild.leave();
			this.client.emit('warn', `Blacklisted guild detected: ${guild.name} [${guild.id}]`);
		}
		console.log(`Joined guild ${guild.name} [${guild.id}]`);
		this.client.user.setActivity(`Scrambling cubes for ${bot.guilds.size} servers! | s!help`);
	}

};
