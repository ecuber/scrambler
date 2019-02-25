module.exports.run = async (bot, message, args, cube) => {
	let miliseconds = bot.uptime;
	let days, hours, minutes, total_hours, total_minutes, total_seconds;
	total_seconds = parseInt(Math.floor(miliseconds / 1000));
	total_minutes = parseInt(Math.floor(total_seconds / 60));
	total_hours = parseInt(Math.floor(total_minutes / 60));
	days = parseInt(Math.floor(total_hours / 24));
	minutes = parseInt(total_minutes % 60);
	hours = parseInt(total_hours % 24);
	let uptimeStr = `${days} days, ${hours} hours, ${minutes} minutes`;
	return message.channel.send(`Scrambler has been online for ${uptimeStr}`);
};
module.exports.config = { name: "uptime", aliases: [] };
