const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emotes = require("../../botconfig/emojis.json");

module.exports = {
  name: "invite",
  description: "Invite me to your server!",
  aliases: ["add", "invitebot", "invite-bot", "inviteme", "invite-me"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setTitle(`Invite me to your server`)
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=19464`
      )
      .setDescription(
        `[||Invite me to your server without slash commands||](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=19464)`
      )
      .setColor(ee.color)
      .setFooter({
        text: ee.footertext.replace("{username}", client.user.username),
        iconURL: ee.footericon.replace(
          "{avatar}",
          client.user.displayAvatarURL()
        ),
      })
      .setTimestamp();

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setEmoji("➕")
        .setStyle("LINK")
        .setLabel("Invite")
        .setURL(
          `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=19464`
        ),
      new MessageButton()
        .setEmoji(emotes.buttons.discord)
        .setStyle("LINK")
        .setLabel("Support server")
        .setURL(client.config.support)
    );

    message.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
