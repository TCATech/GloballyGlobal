const { Client, Message, MessageEmbed } = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emotes = require("../../botconfig/emojis.json");

module.exports = {
  name: "setup-global",
  description: "Setup the global chat system for your server.",
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

    const channel = message.mentions.channels.first();
    if (!channel)
      return message.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription(
              "You need to mention a channel to set as the global chat channel."
            )
            .setColor(ee.errcolor),
        ],
      });

    client.db.ensure("channels", []);

    client.db.push("channels", channel.id);

    await message.reply({
      embeds: [
        embed
          .setTitle(`${emotes.success} Success!`)
          .setDescription(`The global chat channel has been set to ${channel}`),
      ],
    });
  },
};
