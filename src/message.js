/* eslint-disable complexity */
/* eslint-disable sort-keys */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const db = require("./core/db");
const fn = require("./core/helpers");
const cmdArgs = require("./commands/args");


// --------------------
// Listen for messages
// --------------------

// eslint-disable-next-line no-unused-vars
module.exports = function run (config, message, edited, deleted)
{

   module.exports.message = message;
   const client = message.client;
   const bot = client.user;
   if (message.channel.type === "dm" || message.type !== "DEFAULT")
   {

      return;

   }
   if (!db.server_obj[message.guild.id])
   {

      return;

   }

   // ------------------------
   // Ignore messages by bots
   // ------------------------
   const bot2botstyle = db.server_obj[message.guild.id].db.bot2botstyle;

   if (bot2botstyle === "off")
   {

      if (message.author.bot)
      {

         return;

      }

   }
   else if (bot2botstyle === "on")
   {

      // eslint-disable-next-line no-bitwise
      if (message.webhookID)
      {

         return;

      }
      if (message.author.id === message.client.user.id)
      {

         return;

      }

   }

   FileOverride: if (message.content === "" || message.content === " ")
   {

      if (message.attachments.size !== 0)
      {

         const col = "images";
         let id = "bot";
         db.increaseStatsCount(col, id);

         if (message.channel.type === "text")
         {

            id = message.channel.guild.id;

         }

         db.increaseStatsCount(col, id);
         break FileOverride;

      }

      console.log(`--m.js--- Empty Message Error: ----1----\nServer: ${message.channel.guild.name},\nChannel: ${message.channel.id} - ${message.channel.name},\nMessage ID: ${message.id},\nContent: ${message.content},\nWas Image: ${message.attachments},\nwas Embed: ${message.embeds},\nSender: ${message.member.displayName} - ${message.member.id},\nTimestamp: ${message.createdAt}\n----------------------------------------`);

   }

   GifOverride: if (message.embeds.length !== 0)
   {

      if (message.content.startsWith("https://tenor.com/"))
      {

         const col = "gif";
         let id = "bot";
         db.increaseStatsCount(col, id);

         if (message.channel.type === "text")
         {

            id = message.channel.guild.id;

         }

         db.increaseStatsCount(col, id);
         break GifOverride;

      }
      if (message.embeds[0].description)
      {

         message.content = message.embeds[0].description;

      }
      else if (message.content === "" || message.content === " ")
      {

         console.log(`--m.js--- Empty Message Error: ----2----\nServer: ${message.channel.guild.name},\nChannel: ${message.channel.id} - ${message.channel.name},\nMessage ID: ${message.id},\nContent: ${message.content},\nWas Image: ${message.attachments},\nwas Embed: ${message.embeds},\nSender: ${message.member.displayName} - ${message.member.id},\nTimestamp: ${message.createdAt}\n----------------------------------------`);
         return;

      }

   }


   // -----------------------------------------
   // Embed member permissions in message data
   // -----------------------------------------

   if (message.channel.type === "text" && message.member)
   {

      message.isAdmin =
         message.member.permissions.has("ADMINISTRATOR");

      message.isManager =
         fn.checkPerm(
            message.member,
            message.channel,
            "MANAGE_CHANNELS"
         );

      // Add role color
      message.roleColor = fn.getRoleColor(message.member);

   }

   // ------------
   // Data object
   // ------------

   const data = {
      "canWrite": true,
      "channel": message.channel,
      config,
      client,
      "member": message.member,
      bot,
      message
   };
   if (data.message.channel.type !== "dm")
   {

      if (data.member)
      {

         // Replace username with nickname if exists
         if (data.member.displayName)
         {

            data.message.author.username = data.member.displayName;

         }

      }

   }

   // ------------------
   // Proccess Commands
   // ------------------

   if (message.content !== undefined)

   {

      if (message.content.startsWith(config.translateCmd) || message.content.startsWith(config.translateCmdShort) || message.mentions.has(bot.id))
      {

         // eslint-disable-next-line consistent-return
         return cmdArgs(data);

      }

   }

   // --------------------------
   // Check for automatic tasks
   // --------------------------

   // eslint-disable-next-line consistent-return
   return db.channelTasks(data);

};
