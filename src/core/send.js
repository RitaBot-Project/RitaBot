// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
const colors = require("./colors");
const fn = require("./helpers");
const db = require("./db");
const logger = require("./logger");
const discord = require("discord.js");
const webHookName = "Translator Messaging System";

// ---------------------
// Send Data to Channel
// ---------------------

// eslint-disable-next-line complexity
module.exports = function(data)
{
   // ----------------------------
   // Regex Statments for Emoji's
   // ----------------------------

   function languageRegex(data)
   {
      // Remove Whitespaces
      data.text = data.text.replace(/<.+?>/g, tag => tag.replace(/\s+/g, ""));
      //  Remove translated numeral keywords
      data.text = data.text.replace(/millions/gmi, ``);
      data.text = data.text.replace(/milioni/gmi, ``);
      // Commas Replacement
      const regex10 = /(?<=<[^<>]*?),+(?=[^<>]*>)/gm;
      data.text = data.text.replace(regex10, ``);
      // Period Replacement
      const regex11 = /(?<=<[^<>]*?)\.+(?=[^<>]*>)/gm;
      data.text = data.text.replace(regex11, ``);
      //  Remove Exclamation marks
      data.text = data.text.replace(/<@!/gmi, `<@`);
      data.text = data.text.replace(/<!@/gmi, `<@`);
      //  Change formatted special characters to normal
      data.text = data.text.replace(/：/gmi, ":");
      data.text = data.text.replace(/，/gmi, ", ");
      data.text = data.text.replace(/、/gmi, ", ");
      data.text = data.text.replace(/！/gmi, "");
      data.text = data.text.replace(/<A/gmi, "<a");
      data.text = data.text.replace(/>/gmi, ">");
      data.text = data.text.replace(/</gm, "<");
      data.text = data.text.replace(/<А/gmi, "<a");
      data.text = data.text.replace(/＆/gmi, ``);
      data.text = data.text.replace(/></gm, `> <`);
      data.text = data.text.replace(/＃/gmi, "#");
      data.text = data.text.replace(/＃/gmi, "#");
      data.text = data.text.replace(/((\s?)(\*)(\s?))/gmis, "*");
      data.text = data.text.replace(/(?<=<[^<>]*?)([0-9]*)\s*@+(?=[^<>]*>)/gmi, "@$1");
   }

   if (data.author)
   {
      if (data.text)
      {
         languageRegex(data);
         data.text = data.text.replace(/<А/gmi, "<a");
         if (data.text.includes("<А" || "<a"))
         {
            const regex1 = /<(a)([:?\s:\s[a-z0-9ЁёА-я_A-Z\s\u00C0-\u017F]+\S*:\s*)([0-9\s]+)>/gmi;
            const str1 = data.text;
            const subst1 = `<a:customemoji:$3>`;
            data.text = str1.replace(regex1, subst1);
         }
         //   if a combination of animated emojis and normal custom emojis
         if (!data.text.includes("<a") && data.text.includes("<:"))
         {
            const subst5 = "<:customemoji:$3>";
            const str5 = data.text;
            const regx5 = /<:([:?\s:\s[a-z0-9ЁёА-я_A-Z\s\u00C0-\u017F]+\S*(:)\s*)([0-9\s]+)>/gmi;
            data.text = str5.replace(regx5, subst5);
         }
         if (data.text.includes("<a") && data.text.includes("<:"))
         {
            const regex20 = /<(a)([:?\s:\s[a-z0-9ЁёА-я_A-Z\s\u00C0-\u017F]+\S*:\s*)([0-9\s]+)>/gmi;
            const regex30 = /<:([:?\s:\s[a-z0-9ЁёА-я_A-Z\s\u00C0-\u017F]+\S*(:)\s*)([0-9\s]+)>/gmi;
            data.text.replace(regex20, "<a:customemoji:$3>");
            data.text.replace(regex30, "<:customemoji:$3>");
         }
      }
   }

   // ----------------------------------------------------
   // The first time this runs after a reset it will
   // always send as Off state as set.EmbedVar = "",
   // Alot of this is debug code, but left in for testing
   // ----------------------------------------------------


   console.log(`Guild ID from message`);
   console.log(`Raw = ` + data.message.guild.id);
   const guildValue = data.message.guild.id;
   console.log(`Const = ` + guildValue);
   console.log(`---------------------`);

   function ignoreMessage(data)
   {
      const ignoreMessageEmbed = new discord.RichEmbed()
         .setColor(colors.get(data.color))
         .setTitle("**Bot Alert**\n")
         .setAuthor(data.bot.username, data.bot.icon_url || "https://ritabot.org/index/images/favicon.png")
         .setDescription(data.text)
         .setTimestamp()
         .setFooter("𝗕𝗼𝘁𝗵 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀  𝘄𝗶𝗹𝗹 𝘀𝗲𝗹𝗳-𝗱𝗲𝘀𝘁𝗿𝘂𝗰𝘁 𝗶𝗻 10 𝘀𝗲𝗰𝗼𝗻𝗱𝘀");
      message.reply(ignoreMessageEmbed).then(msg =>
      {
         msg.delete(10000);
      });
   }

   console.log(`db.set Stage 1 = ` + db.setEmbedVar());
   db.getEmbedVar(guildValue);

   if (db.setEmbedVar() === "")
   {
      // eslint-disable-next-line no-unused-expressions
      db.setEmbedVar;
      console.log(`db.set Stage 2 = ` + db.setEmbedVar());
      var output =
      "**:robot: Your bot has restarted\n\n" +
      " :gear: Please resend your previous message.**\n\n" +
      "  :wrench: You may need to define the embed value using `!t embed on/off` if this message is in a loop when sending commands/messages.";
      data.color = "warn";
      data.text = output;
      return ignoreMessage(data);
   }
   else
   // eslint-disable-next-line no-else-return
   {
      console.log(`db.set Stage 3 = ` + db.setEmbedVar());
   }
   console.log(`db.set Stage 4 = ` + db.setEmbedVar());

   // --------------------
   // Primary If Statment
   // --------------------

   if (db.setEmbedVar() === "on")
   {
      embedOn(data);
   }
   else
   {
      embedOff(data);
   }
};

// ----------------------------
// Embedded Variable "On" Code
// ----------------------------

const embedOn = function(data)
{
   const sendBox = function(data)
   {
      if (data.author)
      {
         data.author = {
            name: data.author.username,
            //eslint-disable-next-line camelcase
            icon_url: data.author.displayAvatarURL
         };
      }

      if (data.text && data.text.length > 1)
      {
         if (!data.author)
         {
            if (!data.bot)
            {
               username = data.channel.client.user.username;
               icon_url = data.channel.client.user.displayAvatarURL;
            }
            else
            {
               username = data.bot.username;
               icon_url = data.bot.icon_url;
            }

            const botEmbedOn = new discord.RichEmbed()
               .setColor(colors.get(data.color))
               .setAuthor(username, icon_url)
               .setDescription(data.text)
               .setTimestamp()
               .setFooter("This message will self-destruct in one minute");

            message.channel.send(botEmbedOn).then(msg =>
            {
               msg.delete(60000);
            });
         }
         else
         {
            data.channel.send({
               embed: {
                  title: data.title,
                  fields: data.fields,
                  author: data.author,
                  color: colors.get(data.color),
                  description: data.text,
                  footer: data.footer
               }
            }).then(() =>
            {
               sendEmbeds(data);
               sendAttachments(data);
            }).catch(err =>
            {
               var errMsg = err;
               logger("dev", err);

               // ------------------------
               // Error for long messages
               // ------------------------

               if (err.code && err.code === 50035)
               {
                  data.channel.send(":warning:  Message is too long.");
               }

               // -----------------------------------------------------------
               // Handle error for users who cannot recieve private messages
               // -----------------------------------------------------------

               if (err.code && err.code === 50007 && data.origin)
               {
                  const badUser = data.channel.recipient;
                  errMsg = `@${badUser.username}#${badUser.discriminator}\n` + err;

                  db.removeTask(data.origin.id, `@${badUser.id}`, function(er)
                  {
                     if (er)
                     {
                        return logger("error", er);
                     }

                     return data.origin.send(
                        `:no_entry: User ${badUser} cannot recieve direct messages ` +
                           `by bot because of **privacy settings**.\n\n__Auto ` +
                           `translation has been stopped. To fix this:__\n` +
                           "```prolog\nServer > Privacy Settings > " +
                           "'Allow direct messages from server members'\n```"
                     );
                  });
               }

               logger("error", errMsg);
            });
         }
      }
      else if (data.attachments.array().length > 0)
      {
         sendAttachments(data);
      }
   };

   // -----------------------------------------------
   // Resend embeds from original message
   // Only if content is forwared to another channel
   // -----------------------------------------------

   const sendEmbeds = function(data)
   {
      if (data.forward && data.embeds && data.embeds.length > 0)
      {
         const maxEmbeds = data.config.maxEmbeds;

         if (data.embeds.length > maxEmbeds)
         {
            sendBox({
               channel: data.channel,
               text: `:warning:  Cannot embed more than ${maxEmbeds} links.`,
               color: "warn"
            });

            data.embeds = data.embeds.slice(0, maxEmbeds);
         }

         for (let i = 0; i < data.embeds.length; i++)
         {
            data.channel.send(data.embeds[i].url);
         }
      }
   };

   // -------------------
   // Resend attachments
   // -------------------

   const sendAttachments = function(data)
   {
      var attachments = data.attachments.array();

      if (data.forward && attachments && attachments.length > 0)
      {
         const maxAtt = data.config.maxEmbeds;

         if (attachments.length > maxAtt)
         {
            sendBox({
               channel: data.channel,
               text: `:warning:  Cannot attach more than ${maxAtt} files.`,
               color: "warn"
            });
            attachments = attachments.slice(0, maxAtt);
         }

         for (let i = 0; i < attachments.length; i++)
         {
            const attachmentObj = new discord.Attachment(
               attachments[i].url,
               attachments[i].filename
            );
            data.channel.send(attachmentObj);
         }
      }
   };

   checkPerms(data, sendBox);
};

// -----------------------------
// Embedded Variable "Off" Code
// -----------------------------

const embedOff = function(data)
{
   // -------------
   // Create Files
   // -------------

   function createFiles(dataAttachments)
   {
      if (!dataAttachments && !dataAttachments.array().length > 0) {return;}
      var attachments = dataAttachments.array();
      const files = [];
      if (attachments && attachments.length > 0)
      {
         for (let i = 0; i < attachments.length; i++)
         {
            const attachmentObj = new discord.Attachment(
               attachments[i].url,
               attachments[i].filename
            );
            files.push(attachmentObj);
         }
      }
      return files;
   }

   // ---------------------
   // Send Webhook Message
   // ---------------------

   /*  if (message.member)
   {
      if (message.member.nickname)
      {
         nicknameVar = message.member.nickname;
      }
      if (data.text === undefined)
      {
         nicknameVar = message.author.username;
      }
      if (data.text && message.member.nickname === undefined | null)
      {
         nicknameVar = data.author.username;
      }
   }
   if (!message.member)
   {
      if (data.emoji)
      {
         nicknameVar = data.author.username;
      }
   }*/
   if (data.author)
   {
      nicknameVar = data.author.name || data.author.username;
   }
   function sendWebhookMessage(webhook, data)
   {
      if (data.author)
      {
         data.author = {
            name: data.author.username,
            // eslint-disable-next-line camelcase
            icon_url: data.author.displayAvatarURL
         };
      }
      if (data.bot)
      {
         data.bot = {
            username: data.bot.username,
            // eslint-disable-next-line camelcase
            icon_url: data.bot.displayAvatarURL
         };
      }
      const files = createFiles(data.attachments);
      if (!data.author)
      {
         if (data.text === undefined)
         {
            webhook.send(data.text, {
               "username": message.author.username,
               "avatarURL": message.author.displayAvatarURL,
               "files": files
            });
         }
         else
         {
            message.delete(5000);
            const botEmbedOff = new discord.RichEmbed()
               .setColor(colors.get(data.color))
               .setAuthor(data.bot.username, data.bot.icon_url)
               .setDescription(data.text)
               .setTimestamp()
               .setFooter("This message will self-destruct in one minute");

            data.channel.send(botEmbedOff).then(msg =>
            {
               msg.delete(60000);
            });
         }
      }
      else
      {
         if (data.author)
         {
            if (data.author.name) { username = data.author.name;}
            if (data.author.icon_url) { avatarURL = data.author.icon_url;}
         }
         {
            webhook.send(data.text, {
               "username": data.author.name || data.author.username,
               "avatarURL": data.author.icon_url,
               "files": files
            });
         }
      }
   }

   // ---------------------
   // Send Data to Channel
   // ---------------------

   const sendBox = function(data)
   {
      const channel = data.channel;


      let color = colors.get(data.color);
      let avatarURL;
      if (data.author && data.author.icon_url)
      {
         avatarURL = data.author.displayAvatarURL;
      }
      if (!channel) {return console.log("Channel not specified.");}
      // Sets the color of embed message but no embed message used so thus unused.
      if (!color) {color = colors.get(data.color);}
      if (!avatarURL) {avatarURL = data.author;}

      // -----------------------------
      // Webhook Creation and Sending
      // -----------------------------

      if (data.channel.type === "dm")
      {
         const embed = new discord.RichEmbed()
            .setAuthor(message.member.nickname || data.author.name, data.author.displayAvatarURL)
            .setColor(colors.get(data.color))
            .setDescription(data.text)
            .setFooter(data.footer.text);
         sendAttachments(data);
         data.channel.send({embed});
      }

      else
      {
         channel.fetchWebhooks()
            .then(webhooks =>
            {
               // You can rename 'Webhook' to the name of your bot if you like, people will see if under the webhooks tab of the channel.
               existingWebhook = webhooks.find(x => x.name === webHookName);
               const webHookURL = "https://ritabot.org/index/images/favicon.png"

               if (!existingWebhook)
               {
                  channel.createWebhook(webHookName, webHookURL)
                     .then(newWebhook =>
                     {
                        // Finally send the webhook
                        sendWebhookMessage(newWebhook, data);
                     });
               }
               else
               {
                  sendWebhookMessage(existingWebhook, data);
               }
            });
      }
   };

   // -------------------
   // Resend attachments
   // -------------------

   const sendAttachments = function(data)
   {
      if (!data.attachments && !data.attachments.array().length > 0) {return;}
      var attachments = data.attachments.array();

      if (data.forward && attachments && attachments.length > 0)
      {
         const maxAtt = data.config.maxEmbeds;

         if (attachments.length > maxAtt)
         {
            sendBox({
               channel: data.channel,
               text: `:warning:  Cannot attach more than ${maxAtt} files.`,
               color: "warn"
            });
            attachments = attachments.slice(0, maxAtt);
         }

         for (let i = 0; i < attachments.length; i++)
         {
            const attachmentObj = new discord.Attachment(
               attachments[i].url,
               attachments[i].filename
            );
            data.channel.send(attachmentObj);
         }
      }
   };

   checkPerms(data, sendBox);
};

// -----------------
// Permission Check
// -----------------

// This is the last step before the message is send, each function ends here.
const checkPerms = function(data, sendBox)
{
   // ------------------------------------------------------------------------
   // Analyze Data and determine sending style (system message or author box)
   // ------------------------------------------------------------------------

   //eslint-disable-next-line complexity
   {
      var sendData = {
         title: data.title,
         fields: data.fields,
         config: data.config,
         channel: data.message.channel,
         color: data.color,
         text: data.text,
         footer: data.footer,
         embeds: data.message.embeds,
         attachments: data.message.attachments,
         forward: data.forward,
         origin: null,
         bot: data.bot
      };
   }

   // ---------------------------------------------------
   // Notify server owner if bot cannot write to channel
   // ---------------------------------------------------

   if (!data.canWrite)
   {
      const writeErr =
         ":no_entry:  **Translate bot** does not have permission to write at " +
         `the **${sendData.channel.name}** channel on your server **` +
         `${sendData.channel.guild.name}**. Please fix.`;

      return sendData.channel.guild.owner
         .send(writeErr)
         .catch(err => logger("error", err));
   }

   if (data.forward)
   {
      const forwardChannel = data.client.channels.get(data.forward);

      if (forwardChannel)
      {
         // ----------------------------------------------
         // Check if bot can write to destination channel
         // ----------------------------------------------

         var canWriteDest = true;

         if (forwardChannel.type === "text")
         {
            canWriteDest = fn.checkPerm(
               forwardChannel.guild.me,
               forwardChannel,
               "SEND_MESSAGES"
            );
         }

         if (canWriteDest)
         {
            sendData.origin = sendData.channel;
            sendData.channel = forwardChannel;
         }

         // ----------------------------------
         // Error if bot cannot write to dest
         // ----------------------------------

         else
         {
            sendData.footer = null;
            sendData.embeds = null;
            sendData.color = "error";
            sendData.text =
                  ":no_entry:  Bot does not have permission to write at the " +
                  `<#${forwardChannel.id}> channel.`;

            // -------------
            // Send message
            // -------------

            return sendBox(sendData);
         }
      }

      // ---------------------------------
      // Error on invalid forward channel
      // ---------------------------------

      else
      {
         sendData.footer = null;
         sendData.embeds = null;
         sendData.color = "error";
         sendData.text = ":warning:  Invalid channel.";

         // -------------
         // Send message
         // -------------

         return sendBox(sendData);
      }
   }

   if (data.showAuthor)
   {
      sendData.author = data.message.author;

      if (data.author)
      {
         sendData.author = data.author;
      }
   }

   // -------------
   // Send message
   // -------------

   return sendBox(sendData);
};
