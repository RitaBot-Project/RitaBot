// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING]
const db = require("./core/db");
const fn = require("./core/helpers");
const cmdArgs = require("./commands/args");


// --------------------
// Listen for messages
// --------------------

//eslint-disable-next-line no-unused-vars
module.exports = function(config, message, edited, deleted)
{
   module.exports.message = message;
   const client = message.client;
   const bot = client.user;
   //const bot2botstyle = db.server_obj[message.guild.id].bot2botstyle;

   // ------------------------
   // Ignore messages by bots
   // ------------------------


   //if (bot2botstyle === "off")
   //{
   if (message.author.bot)
   {
      return;
   }
   //}

   //if (bot2botstyle === "on")
   //{
   //   if (message.author.discriminator === "0000")
   //   {
   //      return;
   //   }
   //}

   // -----------------------------------------
   // Embed member permissions in message data
   // -----------------------------------------

   if (message.channel.type === "text" && message.member)
   {
      message.isAdmin =
         message.member.permissions.has("ADMINISTRATOR");

      message.isManager =
         fn.checkPerm(message.member, message.channel, "MANAGE_CHANNELS");

      // Add role color
      message.roleColor = fn.getRoleColor(message.member);
   }

   // ------------
   // Data object
   // ------------

   const data = {
      client: client,
      config: config,
      bot: bot,
      channel: message.channel,
      message: message,
      member: message.member,
      canWrite: true
   };
   if (data.message.channel.type !== "dm")
   {
      if (data.member.displayName) // Replace username with nickname if exists
      {
         data.message.author.username = data.member.displayName;
      }
   }

   // ------------------
   // Proccess Commands
   // ------------------

   if (message.content.startsWith(config.translateCmd)||message.content.startsWith(config.translateCmdShort)||message.isMentioned(bot))
   {
      return cmdArgs(data);
   }

   // --------------------------
   // Check for automatic tasks
   // --------------------------

   return db.channelTasks(data);
};
