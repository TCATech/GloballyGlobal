const client = require("../index");

client.on("ready", () => {
  setInterval(() => {
    const list = [
      `${client.config.prefix}help`,
      `${client.users.cache.size} users`,
      `${client.guilds.cache.size} servers`,
      `${client.channels.cache.size} channels`,
      "global.tcatech.ml",
      "the TCA Tech team",
    ];
    const randomStatus = list[Math.floor(Math.random() * list.length)];
    let statusType = "WATCHING";
    if (randomStatus === ">help | PainBot.tk") {
      statusType = "LISTENING";
    }

    client.user.setActivity(randomStatus, { type: statusType });
  }, 10000);

  console.log(`${client.user.tag} is now online!`);

  // require("../dashboard")(client);
});
