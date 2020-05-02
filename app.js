const { Client, Schema } = require("klasa");
const settings = require("./settings.json");

const client = new Client({
    fetchAllMembers: false,
    prefix: settings.prefix,
    typing: false,
    production: false,
    prefixCaseInsensitive: true,
    providers: { default: "mongodb" },
    // eslint-disable-next-line no-shadow
    readyMessage: (client) => `Scrambler is ready to go! Now serving ${client.guilds.cache.size} guilds.`
});

client.on("ready", async () => {
    client.user.setActivity(`s!updates | Scrambling cubes for ${client.guilds.cache.size} servers.`);
});

client.gateways.register("guild", {
    provider: "mongodb",
    schema: new Schema()
        .add("prefix", "string", { default: "s!" })
        .add("ignoredChannels", "channel", { array: true })
        .add("comp", "any", { default: {
            enabled: true,
            disabledEvents: [],
            dnfCanPodium: false
        } })
        .add("results", "any", { default: {} })
});

client.login(settings.token);
