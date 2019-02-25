const fs = require("fs");

module.exports.run = async (bot, message, args, cube) => {
	let egg;
	await fs.readdir("./src/eggs/", (err, files) => {
		if(err) {
			console.error(err);
			return message.channel.send("Error sending gif.").then(msg => msg.delete(7000));
		}
		egg = files[Math.floor(Math.random() * files.length)];
		message.channel.send({
			files: [{
				attachment: `./src/eggs/${egg}`,
				name: egg
			}]
		});
	});
};
module.exports.config = { name: "eggs", aliases: ["egg"] };
