const fs = require("fs");

module.exports.run = async (bot, message, args, cube) => {
	message.channel.send({
		files: [{
			attachment: "./src/gifs/jay.gif",
			name: "jay.gif"
		}]
	});
};
module.exports.config = { name: "jay", aliases: ["rip", "f", "fail"] };
