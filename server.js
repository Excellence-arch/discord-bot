const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const { Client, GatewayIntentBits } = require("discord.js");
// const OpenAI = require("openai-api");
// const openai = new OpenAI(process.env.OPENAI_API_KEY);

const { Configuration, OpenAIApi } = require("openai");
// const Tesseract = require("tesseract.js");
const axios = require("axios");

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
let allMsg = [];

https: client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!help") {
    message.channel.send(
      "This bot can generate text from images. Just send an image and wait for the bot to respond."
    );
  } else if (message.content !== "!help" && message.content) {
    allMsg.push({ role: "user", content: message.content });
    console.log(allMsg);
    const response = await newAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: allMsg,
      // prompt: message.content,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    allMsg.push({
      role: "assistant",
      content: response.data.choices[0].message.content,
    });
    console.log(response.data.choices[0].message);
    message.reply(response.data.choices[0].message.content);
  }

  // if (message.attachments.size > 0) {
  //   const attachment = message.attachments.first().url;
  // request.get({ url: attachment, encoding: null }, (err, resp, body) => {
  //   if (err) {
  //     message.reply("An error occured");
  //   } else {
  //     Tesseract.recognize(body)
  //       .then((result) => {
  //         // console.log(result.data.text);
  //         message.reply(result.data.text);
  //       })
  //       .catch((err) => {
  //         message.reply("Error recognizing the image");
  //       });
  //   }
  // });
  // const response = await newAI.createCompletion({
  //   model: "image-alpha-001",
  //   prompt: "Generate caption for an image: ",
  //   image: attachment,
  //   n: 1,
  //   size: "512x512",
  // });
  // const apiKey = process.env.OPENAI_API_KEY;
  // const endpoint = "https://api.openai.com/v1/images/generations";
  // const prompt = `Generate a caption for this image: ${attachment}`;

  // const data = {
  //   model: "image-alpha-001",
  //   prompt,
  //   num_images: 1,
  //   size: "1024x1024",
  //   response_format: "url",
  // };
  // const headers = {
  //   // "Content-Type": "application/json",
  //   Authorization: `Bearer ${apiKey}`,
  // };
  // const response = await axios.post(endpoint, data, { headers });
  // console.log(response.data.data);
  // const captionUrl = response.data.data[0].url;
  // const captionResponse = await axios.get(captionUrl, { headers });
  // console.log(captionResponse.data);
  // const caption = captionResponse.data.data[0].text;
  // message.reply(`Caption: ${caption}`);
  // }
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
