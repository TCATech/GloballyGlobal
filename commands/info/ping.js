const { Client, Message, MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emotes = require("../../botconfig/emojis.json");
const ms = require("ms");

module.exports = {
  name: "ping",
  description: "Ping the bot!",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor(ee.color)
      .setFooter({
        text: ee.footertext.replace("{username}", client.user.username),
        iconURL: ee.footericon.replace(
          "{avatar}",
          client.user.displayAvatarURL()
        ),
      })
      .setTimestamp();
    const msg = await message.reply({
      embeds: [embed.setTitle(`${emotes.loading} Pinging...`)],
    });

    const ping = msg.createdTimestamp - message.createdTimestamp;

    await msg.edit({
      embeds: [
        embed
          .setTitle(`${emotes.pong} Pong!`)
          .addField("Bot Ping", `${ping}ms`, true)
          .addField("API Ping", `${client.ws.ping}ms`, true)
          .addField("Uptime", ms(client.uptime, { long: true }, true), true),
      ],
    });
  },
};
