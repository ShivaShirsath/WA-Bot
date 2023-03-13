const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const { Configuration, OpenAIApi } = require("openai");

module.exports = shiva = async (client, m, chatUpdate, store) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    // Group
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    if (isCmd2 && !m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`)
      );
    } else if (isCmd2 && m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
        chalk.blueBright("IN"),
        chalk.green(groupName)
      );
    }

    if (isCmd2) {
      switch (command) {
        case "💝":
          /*const sendMsg = await client.sendMessage(from, {
            text: ``,
            footer: "",
            buttons: [
              {
                buttonId: "id1",
                buttonText: { displayText: ".h" },
                type: 1,
              },
              {
                buttonId: "id2",
                buttonText: { displayText: ".I" },
                type: 1,
              },
            ],
            headerType: 1,
          });*/
          const sendMsg = await client.sendMessage(from, {
            text: `\`\`\`
 ╭                       ╮



     𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝙱𝙾𝚃 𝙾𝚙𝚎𝚗𝙰𝙸
        🪀    🤖   ✳️


    💭               
 ╰                       ╯
\`\`\``,
            footer: "© Shiva Shirsath",
            templateButtons: [
              {
                index: 1,
                urlButton: {
                  displayText: ".💛 What is java? Give a Code.",
                  url: "http://wa.me/+919130057189?text=.💛%20",
                },
              },
              {
                index: 2,
                urlButton: {
                  displayText: ".💖 Image of Successful Robot",
                  url: "http://wa.me/+919130057189?text=.💖%20",
                },
              },
            ],
            image: {
              url: "https://raw.githubusercontent.com/ShivaShirsath/WA-Bot/master/logo.png",
            },
          });
          console.log(sendMsg);
          break;
        case "💛":
          try {
            if (process.env.KEYOPENAI === "ISI_APIKEY_OPENAI_DISINI")
              return reply(
                `
The api key has not been filled.

The api key can be generated on the website:
https://beta.openai.com/account/api-keys
`
              );
            if (!text)
              return await client.sendMessage(from, {
                text: `\`\`\`
 ╭                       ╮



     𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝙱𝙾𝚃 𝙾𝚙𝚎𝚗𝙰𝙸
        🪀    🤖   ✳️


    💭               
 ╰                       ╯
 ┏══════════════┓
\`\`\`               Get Answer from AI

               Specify your Question,

              Example:
                ${prefix}${command} What is a recession  
\`\`\` ┗══════════════┛\`\`\``,
                footer: "© Shiva Shirsath",
                templateButtons: [
                  {
                    index: 1,
                    urlButton: {
                      displayText: ".💛 What is java? Give a Code.",
                      url: "http://wa.me/+919130057189?text=.💛%20",
                    },
                  },
                ],
                image: {
                  url: "https://raw.githubusercontent.com/ShivaShirsath/WA-Bot/master/logo.png",
                },
              });
            const configuration = new Configuration({
              apiKey: process.env.KEYOPENAI,
            });
            const openai = new OpenAIApi(configuration);

            const response = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "user",
                  content: text,
                },
              ],
            });
            /*await openai.createCompletion({
              model: "text-davinci-003",
              prompt: text,
              temperature: 0, // Higher values means the model will take more risks.
              max_tokens: 2048, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
              top_p: 1, // alternative to sampling with temperature, called nucleus sampling
              frequency_penalty: 0.3, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
              presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
            });*/
            m.reply(`${response.data.choices[0].message.content}`);
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
              console.log(`${error.response.status}\n\n${error.response.data}`);
            } else {
              console.log(error);
              m.reply("Sorry, there seems to be an error:" + error.message);
            }
          }
          break;
        case "💖":
          try {
            if (process.env.KEYOPENAI === "ISI_APIKEY_OPENAI_DISINI")
              return reply(
                `
The api key has not been filled.

The api key can be generated on the website:
https://beta.openai.com/account/api-keys
`
              );
            if (!text)
              return await client.sendMessage(from, {
                text: `\`\`\`
 ╭                       ╮



     𝚆𝚑𝚊𝚝𝚜𝚊𝚙𝚙 𝙱𝙾𝚃 𝙾𝚙𝚎𝚗𝙰𝙸
        🪀    🤖   ✳️


    💭               
 ╰                       ╯
 ┏══════════════┓
\`\`\`           Create an image from AI

        Imaging and explain it in text,

        Example:
          ${prefix}${command} House on snow mountain  
\`\`\` ┗══════════════┛\`\`\``,
                footer: "© Shiva Shirsath",
                templateButtons: [
                  {
                    index: 2,
                    urlButton: {
                      displayText: ".💖 Image of Successful Robot",
                      url: "http://wa.me/+919130057189?text=.💖%20",
                    },
                  },
                ],
                image: {
                  url: "https://raw.githubusercontent.com/ShivaShirsath/WA-Bot/master/logo.png",
                },
              });
            const configuration = new Configuration({
              apiKey: process.env.KEYOPENAI,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createImage({
              prompt: text,
              n: 1,
              size: "512x512",
            });
            //console.log(response.data.data[0].url)
            client.sendImage(from, response.data.data[0].url, text, mek);
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
              console.log(`${error.response.status}\n\n${error.response.data}`);
            } else {
              console.log(error);
              m.reply("Sorry, there seems to be an error:" + error.message);
            }
          }
          break;
        default: {
          if (isCmd2 && budy.toLowerCase() != undefined) {
            if (m.chat.endsWith("broadcast")) return;
            if (m.isBaileys) return;
            if (!budy.toLowerCase()) return;
            if (argsLog || (isCmd2 && !m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(
                chalk.black(chalk.bgRed("[ ERROR ]")),
                color("command", "turquoise"),
                color(`${prefix}${command}`, "turquoise"),
                color("not available", "turquoise")
              );
            } else if (argsLog || (isCmd2 && m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(
                chalk.black(chalk.bgRed("[ ERROR ]")),
                color("command", "turquoise"),
                color(`${prefix}${command}`, "turquoise"),
                color("not available", "turquoise")
              );
            }
          }
        }
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
