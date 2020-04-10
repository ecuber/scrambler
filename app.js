const { Client } = require('klasa');
const settings = require("./settings.json");

new Client({
    fetchAllMembers: false,
    prefix: settings.prefix,
    typing: false,
    readyMessage: (client) => `Scrambler is ready to go! Now serving ${client.guilds.size} guilds.`
}).login(settings.token);