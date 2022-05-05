const { Client, Collection } = require("discord.js");
require("dotenv/config");
const client = new Client({
  intents: 32767,
  restTimeOffset: 0,
  allowedMentions: {
    repliedUser: false,
  },
});
const Enmap = require("enmap");
module.exports = client;

client.config = require("./botconfig/config.json");
client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
client.db = new Enmap({
  name: "globalChannels",
  dataDir: "./databases/channels",
});

require("./handler")(client);

client.login(process.env.TOKEN);
