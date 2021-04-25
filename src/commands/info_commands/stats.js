// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const langCheck = require("../../core/lang.check");
const db = require("../../core/db");
const auth = require("../../core/auth");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");

// -------------
// Command Code
// -------------

module.exports = function(data)
{
   // -------------
   // Version Info
   // -------------

   var version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {
      version += ` ([changelog](${auth.changelog}))`;
   }

   // ------------------------
   // Get Stats from Database
   // ------------------------

   //eslint-disable-next-line complexity
   db.getStats(function(stats)
   {
      // Get global server information
      const botLang = langCheck(stats[0].botLang).valid[0];

      const activeTasks = stats[0].activeTasks - stats[0].activeUserTasks;

      const globalStats =
         `**\`\`\`@${data.bot.username} - Global Stats\`\`\`**\n` +
         `:earth_africa:  Default bot language:  ` +
         `**\`${botLang.name} (${botLang.native})\`` +
         `**\n\n:bar_chart:  Translated **\`${stats[0].totalCount}\`** messages ` +
         `across **\`${data.client.guilds.size}\`** servers ` +
         `for **\`${data.message.client.users.size} users.\`**\n\n` + //db.server_obj.size for total count in d.js v12
         `:regional_indicator_v:  Version:  ${version}\n\n` +
         `:repeat:  Automatic translation:  ` +
         `**\`${activeTasks}\`**  channels and  ` +
         `**\`${stats[0].activeUserTasks}\`**  users`;

      // Get current server information
      var serverStats = "";
      if (data.message.channel.type === "text" && data.cmd.server.length === 1)
      {
         const serverLang = langCheck(data.cmd.server[0].lang).valid[0];

         const embedVar = data.cmd.server[0].embedstyle;
         const bot2BotVar = data.cmd.server[0].bot2botstyle;
         const webhookVar = data.cmd.server[0].webhookactive;

         const activeServerTasks =
               data.cmd.server[0].activeTasks - data.cmd.server[0].activeUserTasks;

         serverStats =
               `**\`\`\`${data.message.channel.guild.name} - Server Info` +
               `\`\`\`**\n:earth_africa:  Default server language:  ` +
               `**\`${serverLang.name} (${serverLang.native})\`` +
               `**\n\n:bar_chart:  Translated messages:  ` +
               `**\`${data.cmd.server[0].count}\`**\n\n` +
               `:repeat:  Automatic translation:  ` +
               `**\`${activeServerTasks}\`**  channels and  ` +
               `**\`${data.cmd.server[0].activeUserTasks}\`**  users\n\n` +
               `:person_facepalming: Users in Server: **\`${data.message.channel.guild.memberCount}\`**\n\n` +
               `:inbox_tray: Embedded Message Status: **\`${embedVar}\`**\n\n` +
               `:robot: Bot to Bot Translation Status: **\`${bot2BotVar}\`**\n\n` +
               `:information_source: Webhook Debug Active State: **\`${webhookVar}\`**`;
      }

      data.color = "info";

      var debugStats = "";
      if (data.message.channel.type === "text" && data.cmd.server.length === 1)
      {
         const webhookIDVar = data.cmd.server[0].webhookid;
         const webhookTokenVar = data.cmd.server[0].webhooktoken;
         const webhookVar = data.cmd.server[0].webhookactive;

         debugStats =
               `**\`\`\`${data.message.channel.guild.name} - Server Info\`\`\`**\n` +
               `:id: Webhook Debug ID: ` +
               `**\`\`\`${webhookIDVar}\`\`\`**\n ` +
               `:key: Webhook Debug Token: ` +
               `**\`\`\`${webhookTokenVar}\`\`\`**\n ` +
               `:information_source: Webhook Debug Active State: **\`${webhookVar}\`**`;
      }

      data.color = "info";

      // Special case: !t stats global
      if (data.cmd.params && data.cmd.params.toLowerCase().includes("global"))
      {
         data.text = globalStats;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      // Only '!t stats global' is allowed with dm
      if (data.message.channel.type === "dm")
      {
         data.color = "warn";
         data.text = "You must call server stats from a server channel.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      // No server data was available
      if (!serverStats)
      {
         data.color = "error";
         data.text = "This server is not registered in the database.";
         logger(
            "error",
            "'UNREGISTERED'\n" +
            data.message.channel.guild.name + "\n" +
            data.message.channel.guild.id);

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      // Case: !t stats server
      if (data.cmd.params && data.cmd.params.toLowerCase().includes("server"))
      {
         data.text = serverStats;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      if (data.cmd.params && data.cmd.params.toLowerCase().includes("debug"))
      {
         if (data.message.isAdmin === false)
         {
            data.color = "warn";
            data.text = ":cop:  This command is reserved for server admins.";

            // -------------
            // Send message
            // -------------

            return sendMessage(data);
         }

         if (data.message.isAdmin)
         {
            data.text = debugStats;
         }

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      data.text = globalStats + "\n\n" + serverStats;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   });
};
