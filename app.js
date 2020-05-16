const { Client } = require("klasa");
const settings = require("./settings.json");

const client = new Client({
    fetchAllMembers: false,
    prefix: settings.prefix,
    typing: false,
    production: false,
    prefixCaseInsensitive: true,
    providers: { default: "mongodb" },
    // eslint-disable-next-line no-shadow
    readyMessage: client => `Scrambler is ready to go! Now serving ${client.guilds.cache.size} guilds.`
});

client.on("ready", async () => {
    client.user.setActivity(`s!updates | Scrambling cubes for ${client.guilds.cache.size} servers.`);
});

client.gateways.guilds.schema
    .add("ignored", "textchannel", { array: true })
    .add("comp", folder => folder
        .add("enabled", "boolean", { default: true })
        .add("disabledEvents", "string", { array: true, default: ["2x2x3", "ivy", "4bld", "5bld", "2bld"] }))
    .add("results", "any", { default: {} })
    .add("modRoles", "role", { array: true });

Client.defaultPermissionLevels.add(5, ({ guild, member }) => guild && guild.settings.modRoles.filter(role => member._roles.includes(role).length > 0));

client.login(settings.token);
