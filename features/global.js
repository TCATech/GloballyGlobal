const {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const ee = require("../botconfig/embed.json");
const emotes = require("../botconfig/emojis.json");
const prefixModel = require("../models/prefix");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const row = new MessageActionRow().addComponents([
    new MessageButton()
      .setEmoji("➕")
      .setStyle("LINK")
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=19464`
      )
      .setLabel("Invite me to your server"),
    new MessageButton()
      .setEmoji(emotes.buttons.discord)
      .setStyle("LINK")
      .setURL(client.config.support)
      .setLabel("Support server"),
  ]);

  client.on("messageCreate", async (message) => {
    if (!message.guild || !message.guild.available || message.author.bot)
      return;

    const prefixData = await prefixModel.findOne({
      Guild: message.guild.id,
    });

    let prefix = "";

    if (prefixData) {
      prefix = prefixData.Prefix;
    } else {
      prefix = client.config.prefix;
    }

    if (
      message.content.startsWith(prefix) ||
      message.content.includes(client.user.id)
    )
      return;

    client.db.ensure("channels", []);

    const data = client.db.get("channels");

    if (data.includes(message.channel.id)) {
      const messageData = {
        embeds: [],
        components: [row],
      };
      const embed = new MessageEmbed()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.member.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(message.member.displayAvatarURL({ dynamic: true }))
        .setColor(ee.color)
        .setFooter({
          text: "Sent from " + message.guild.name,
          iconURL: message.guild.icon
            ? message.guild.iconURL({ dynamic: true })
            : ee.footericon.replace("{avatar}", client.user.displayAvatarURL()),
        })
        .setTimestamp();

      if (message.content) {
        embed.setDescription(
          `${emotes.arrow} **Message:**\n>>> ${String(
            message.content
          ).substring(0, 2000)}`
        );
      }

      messageData.embeds = [embed];

      let url = "";
      let imageName = "Unknown";

      function attachIsImage(attachment) {
        url = attachment.url;
        imageName = attachment.name || "Unknown";
        return url(
          indexOf("png", url.length - 3) !== -1 ||
            url.indexOf("PNG", url.length - 3) !== -1 ||
            url.indexOf("jpg", url.length - 3) !== -1 ||
            url.indexOf("JPG", url.length - 3) !== -1 ||
            url.indexOf("jpeg", url.length - 4) !== -1 ||
            url.indexOf("JPEG", url.length - 4) !== -1 ||
            url.indexOf("gif", url.length - 3) !== -1 ||
            url.indexOf("GIF", url.length - 3) !== -1 ||
            url.indexOf("webp", url.length - 3) !== -1 ||
            url.indexOf("WEBP", url.length - 3) !== -1 ||
            url.indexOf("webm", url.length - 3) !== -1 ||
            url.indexOf("WEBM", url.length - 3) !== -1
        );
      }
      if (message.attachments.size > 0) {
        if (message.attachments.every(attachIsImage)) {
          const attachment = new MessageAttachment(url, imageName);
          messageData.files = [attachment];
          embed.setImage("attachment://" + imageName);
        }
      }

      sendAllGlobal(messageData);
    }

    async function sendAllGlobal(data) {
      message.react("🌐").catch(() => {}); //react with a validate emoji;
      // message.delete().catch(()=>{}) // OR delete the message...
      //define a notincachechannels array;
      let notincachechannels = [];
      //send the message back in the same guild
      message.channel.send(data).catch((O) => {});

      client.db.ensure("channels", []);

      const globalChannels = client.db.get("channels");

      //loop through all Channels:
      for (const chid of globalChannels) {
        //get the channel in the cache
        let channel = client.channels.cache.get(chid);
        if (!channel) {
          //if no channel found, continue... but wait! it could mean it is just not in the cache... so fetch it maybe?
          //yes later, first do all cached channels!
          notincachechannels.push(chid);
          continue;
        }
        if (channel.guild.id != message.guild.id) {
          channel.send(data).catch((O) => {});
        }
      }

      //loop through all NOT CACHED Channels:
      for (const chid of notincachechannels) {
        //get the channel in the cache
        let channel = await client.channels.fetch(chid).catch(() => {
          //channel = false; // the channel will not exist, so maybe remove it from your db...
          console.log(`${chid} is not available!`);
        });
        if (!channel) {
          continue;
        }
        if (channel.guild.id != message.guild.id) {
          channel.send(data).catch((O) => {});
        }
      }
    }
  });
};
