const { Client } = require("klasa");
const { getEvents, countScrambles } = require("./util/competition");
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

// Main Settings
client.gateways.guilds.schema
    .add("ignored", "textchannel", { array: true })
    .add("comp", folder => folder
        .add("enabled", "boolean", { default: true })
        .add("active", "boolean", { default: false })
        .add("disabledEvents", "string", { array: true, default: ["2x2x3", "ivy", "4bld", "5bld"] })
        .add("scrambles", sub => getEvents().forEach(event => sub.add(event, "string", { array: true })))
        .add("events", sub => {
            getEvents().forEach(event => {
                sub.add(event, s => {
                    s.add("count", "number", { default: countScrambles(event) });
                    s.add("results", "any");
                });
            });
        })
        .add("pending", sub => {
            getEvents().forEach(event => {
                sub.add(event, "any", { default: { count: null, toggle: false } });
            });
        }))
    .add("modRoles", "role", { array: true })
    .add("banned", folder => folder
        .add("users", "user", { array: true })
        .add("roles", "role", { array: true }))
    .add("archive", "any", { array: true });

Client.defaultPermissionLevels
    .add(5, ({ guild, member }) => guild && guild.settings.modRoles.filter(role => member._roles.includes(role)).length > 0)
    .add(3, ({ guild, member }) => guild && !(guild.settings.banned.roles.filter(role => member._roles.includes(role)).length > 0) || guild.settings.banned.users.includes(member.id));

client.login(settings.token);
