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
module.exports = async function(data)
{
   const before = Date.now();

   global.messageData = data.message;
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

   //const guildValue = data.message.guild.id;
   data.channel = data.message.channel;

   // --------------------
   // Primary If Statment
   // --------------------
   const embedstyle = db.server_obj[data.message.guild.id].db.embedstyle;
   //const serverEmbed = await db.getEmbedVar(id=guildValue);

   if (embedstyle === "on")
   {
      embedOn(data);
   }
   else
   if (data.message.guild.me.hasPermission("MANAGE_WEBHOOKS"))
   {
      embedOff(data);
   }
   else
   {
      console.log("Perms Error");
      data.text = `:warning: ${data.bot.username} does not have sufficient permissions to send Webhook Messages. Please give ${data.bot.username} the \`MANAGE_WEBHOOKS\` permission.`;
      data.color = "warn";

      return data.channel.send({embed: {
         description: data.text,
         color: colors.get(data.color)
      }
      });
   }
   const after = Date.now();
   console.log(after - before);
};

// ----------------------------
// Embedded Variable "On" Code
// ----------------------------

const embedOn = function(data)
{
   const sendBox = function(data)
   {
      /*
      if (data.author)
      {
         data.author = {
            name: data.author.username,
            //eslint-disable-next-line camelcase
            icon_url: data.author.displayAvatarURL
         };
      }*/

      if (data.text && data.text.length > 1)
      {
         //if (!data.author)
         //{
         //if (!data.bot)
         //{
         //username = data.channel.client.user.username;
         // icon_url = data.channel.client.user.displayAvatarURL;
         //}
         //else
         //{
         //username = data.bot.username;
         // icon_url = data.bot.icon_url;
         //}

         //const botEmbedOn = new discord.RichEmbed()
         //.setColor(colors.get(data.color))
         //.setAuthor(username, icon_url)
         //.setDescription(data.text)
         //.setTimestamp()
         // .setFooter("This message will self-destruct in one minute");

         //data.channel.send(botEmbedOn).then(msg =>
         //{
         //  msg.delete(60000);
         // });
         //}
         //else
         //{

         data.channel.send({


            embed: {
               title: data.title,
               fields: data.fields,
               author: {
                  name: data.author.username,
                  icon_url: data.author.displayAvatarURL
               },
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
                     return logger("error", er, "dm");
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
      if (!data.attachments)
      {
         return;
      }
      var attachments = data.attachments.array();

      if (attachments && attachments.length > 0)
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
            data.channel.send(`**${messageData.author.username}** sent a file:`, {file: attachmentObj});
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

   function sendWebhookMessage(webhook, data)
   {
      /*if (data.author)
      {
         data.author = {
            name: data.author.username,
            // eslint-disable-next-line camelcase
            icon_url: data.author.displayAvatarURL
         };
      }*/ // Just use data.author.username
      var files;

      if (data.attachments)
      {
         if (data.attachments.size !== 0)
         {
            files = createFiles(data.attachments);
         }
      }
      else
      {
         files = null;
      }
      if (files !== null && data.text === undefined)
      {
         return webhook.send(null, {
            "username": messageData.author.username,
            "avatarURL": messageData.author.displayAvatarURL,
            "files": files
         });
      }

      //if (data.author)
      //{
      //   if (data.author.name) { username = data.author.name;}
      //   if (data.author.icon_url) { avatarURL = data.author.icon_url;}
      //}
      //{
      webhook.send(data.text, {
         //If you get a error at the below line then the bot does not have write permissions.
         "username": data.author.username || data.message,
         "avatarURL": data.author.displayAvatarURL,
         "files": files
      });
      //}
   }

   // ---------------------
   // Send Data to Channel
   // ---------------------

   const sendBox = function(data)
   {
      const channel = data.channel;


      let color = colors.get(data.color);
      let avatarURL;
      //var messageData = message.data;
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
            .setAuthor(data.author.username, data.author.displayAvatarURL)
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
               const webHookURL = "https://ritabot.gg/index/images/favicon.png";

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
         bot: data.bot,
         //author: {
         //   name: data.bot.username,
         //   icon_url: data.bot.displayAvatarURL
         //}
      };
   }

   // ---------------------------------------------------
   // Notify server owner if bot cannot write to channel
   // ---------------------------------------------------
   if (!data.canWrite)
   {
      console.log("Perm Check 1 " + data.canWrite);
      const writeErr =
         ":no_entry:  **Translate bot** does not have permission to write at " +
         `the **${sendData.channel.name}** channel on your server **` +
         `${sendData.channel.guild.name}**. Please fix.`;

      return sendData.channel.guild.owner
         .send(writeErr)
         .catch(err => logger("error", err, "warning", data.message.guild.name));
   }
   console.log("Perm Check 2 " + data.canWrite);

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
