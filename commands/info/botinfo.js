const {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");
const moment = require("moment");
const ee = require("../../botconfig/embed.json");

module.exports = {
  name: "botinfo",
  description: "Tells you some info about PainBot.",
  aliases: ["bi", "info", "bot"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const embed = new MessageEmbed()
      .setAuthor({
        name: client.user.tag,
        iconURL: ee.footericon.replace(
          "{avatar}",
          client.user.displayAvatarURL()
        ),
      })
      .addField(
        "Servers watching",
        `${client.guilds.cache.size.toLocaleString()} server${
          client.guilds.cache.size > 1 ? "s" : ""
        }`,
        true
      )
      .addField(
        "Channels watching",
        client.channels.cache.size.toLocaleString(),
        true
      )
      .addField("Users watching", client.users.cache.size.toString(), true)
      .addField("Commands", client.commands.size.toLocaleString(), true)
      .addField("Prefix", `\`${message.prefix}\``, true)
      .addField(
        "Made with",
        `[discord.js](https://github.com/discordjs/discord.js)`,
        true
      )
      .addField("Version", client.config.version, true)
      .addField(
        "Created on",
        moment(client.user.createdAt).format("MMMM D, YYYY"),
        true
      )
      .addField("Developer", "Not TCA#6651", true)
      .setColor(ee.color);

    message.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("Invite")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=19464`
            )
        ),
      ],
    });
  },
};
