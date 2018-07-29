const Scrambo = require("scrambo");
module.exports.run = async (bot, message, args, cube) => {
	let cube5 = new Scrambo().type("555").length(60).get();

	message.channel.send(cube5.toString()
		.replace(/r/g, "Rw")
		.replace(/r'/g, "Rw'")
		.replace(/r2/g, "Rw2")
		.replace(/l/g, "Lw")
		.replace(/l'/g, "Lw'")
		.replace(/l2/g, "Lw2")
		.replace(/u/g, "Uw")
		.replace(/u'/g, "Uw'")
		.replace(/u2/g, "Uw2")
		.replace(/d/g, "Dw")
		.replace(/d'/g, "Dw'")
		.replace(/d2/g, "Dw2")
		.replace(/f/g, "Fw")
		.replace(/f'/g, "Fw'")
		.replace(/f2/g, "Fw2")
		.replace(/b/g, "Bw")
		.replace(/b'/g, "Bw'")
		.replace(/b2/g, "Bw2"));
};
module.exports.config = { name: "5x5", aliases: ["5x5x5"] };
