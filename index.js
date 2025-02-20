require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const targetChannelId = process.env.TARGET_CHANNEL_ID;
const monitoredChannels = process.env.MONITORED_CHANNELS.split(",");

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setActivity("success", { type: 3 }); 
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !monitoredChannels.includes(message.channel.id)) return;

    const embeds = []
    for (let [string, attachment] of message.attachments.entries()) {
      if (!attachment || !attachment.contentType.startsWith("image/")) continue;

      embeds.push(
        new EmbedBuilder()
          .setDescription("[Click Here to Join Roo Revenue](<https://whop.com/roorevenue>)")
          .setImage(attachment.url)
          .setColor(0xfafafa)
          .setFooter({ text: `${client.user.displayName} | Success`, iconURL: client.user.displayAvatarURL() })
      )
    }

    const targetChannel = client.channels.cache.get(targetChannelId);
    if (targetChannel) {
        await targetChannel.send({ embeds });
    }
});

client.login(process.env.TOKEN);
