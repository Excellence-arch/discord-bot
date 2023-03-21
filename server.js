const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const { Client, GatewayIntentBits } = require("discord.js");
// const OpenAI = require("openai-api");
// const openai = new OpenAI(process.env.OPENAI_API_KEY);

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const newAI = new OpenAIApi(configuration);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

https: client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!help") {
    message.channel.send(
      "This bot can generate text from images. Just send an image and wait for the bot to respond."
    );
  } else {
    const response = await newAI.createCompletion({
      model: "text-davinci-003",
      prompt: message.content,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // console.log(response.data.choices[0].text);
    message.reply(response.data.choices[0].text);
  }

  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    const response = await newAI.createCompletion({
      model: "image-alpha-001",
      prompt: "Generate caption for an image:",
      image: attachment,
      n: 1,
      size: "512x512",
    });
    console.log(response.data);
    const caption = response.data[0].caption;
    message.reply(`Caption: ${caption}`);
  }
});

client.login(process.env.BOT_TOKEN);

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// const response = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "",
//   temperature: 0.7,
//   max_tokens: 256,
//   top_p: 1,
//   frequency_penalty: 0,
//   presence_penalty: 0,
// });

// // Create a new GPT-3 client
// const client = new GPT3();

// const intents = Discord.Intents;
// intents.messages = true;
// // const intents = new Discord.Intents().add("GUILD_MESSAGES");
// // Create a new Discord client
// const discordClient = new Discord.Client({
//   Intents: [intents],
// });

// // When the Discord client is ready
// discordClient.once("ready", async () => {
//   // Get all the channels
//   const channels = await discordClient.channels.fetch();

//   console.log(channels);
//   // For each channel
//   // channels.forEach(async (channel) => {
//   // Listen for messages
//   // channel.on("message", async (message) => {
//   //   // If the message doesn't come from a bot
//   //   if (!message.author.bot) {
//   //     // Get the response from GPT-3
//   //     const response = await client.query(message.content);
//   //     // Send the response
//   //     message.channel.send(response);
//   //   }
//   // });
//   // });
// });

// // Log the Discord client in
// discordClient.login("YOUR_DISCORD_TOKEN_HERE");

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
