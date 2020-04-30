const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
		return message.send(`Pong! \`${Math.floor(this.client.ws.ping)} ms\``)
	}

};
