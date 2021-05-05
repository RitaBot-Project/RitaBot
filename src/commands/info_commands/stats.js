// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const langCheck = require("../../core/lang.check");
const db = require("../../core/db");
const auth = require("../../core/auth");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");

// -------------
// Command Code
// -------------

module.exports = function run (data)
{

   // -------------
   // Version Info
   // -------------

   let version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {

      version += ` ([changelog](${auth.changelog}))`;

   }

   // ------------------------
   // Get Stats from Database
   // ------------------------

   // eslint-disable-next-line complexity
   db.getStats(function getStats (stats)
   {

      // Get global server information
      const botLang = langCheck(stats[0].botLang).valid[0];

      const activeTasks = stats[0].activeTasks - stats[0].activeUserTasks;

      const globalStats =
         `**\`\`\`@${data.bot.username} - Global Stats\`\`\`**\n` +
         `:earth_africa:  Default bot language:  **\`${botLang.name} (${botLang.native})\`**\n\n` +
         `:bar_chart:  Translated **\`${stats[0].totalCount}\`** messages across  **\`${data.client.guilds.cache.size}\`**  servers for  **\`${db.server_obj.size}\`**  users\n\n` +
         `:regional_indicator_v:  Version:  ${version}\n\n` +
         `:repeat:  Automatic translation:  **\`${activeTasks}\`**  channels and **\`${stats[0].activeUserTasks}\`**  users\n`;

      const translationGlobalStats =
         `**\`\`\`@${data.bot.username} - Global Tranlation Stats\`\`\`**\n` +
         `:bar_chart:  In total **\`${stats[0].message}\`** messages across **\`${data.client.guilds.cache.size}\`** servers have been sent\n\n` +
         `:chart_with_upwards_trend:  RITA has translated **\`${stats[0].translation}\`**  for these servers\n\n` +
         `:frame_photo:  A total of **\`${stats[0].images}\`**  images have been sent and **\`${stats[0].gif}\`** Gif's have been shared\n\n` +
         `:flag_white:  **\`${stats[0].react}\`**  messages have been translated with flag reactions \n\n` +
         `:notebook:  **\`${stats[0].embedon}\`**  messages has been sent in **\`Embed On\`** format\n\n` +
         `:speech_balloon:  **\`${stats[0].embedoff}\`**  messages has been sent in **\`Embed Off\`** format\n`;

      // Get current server information
      let serverStats = "";
      let serverTranslationStats = "";
      if (data.message.channel.type === "text" && data.cmd.server.length === 1)
      {

         const serverLang = langCheck(data.cmd.server[0].lang).valid[0];

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
               `:inbox_tray: Embedded Message Status: **\`${data.cmd.server[0].embedstyle}\`**\n\n` +
               `:robot: Bot to Bot Translation Status: **\`${data.cmd.server[0].bot2botstyle}\`**\n\n` +
               `:information_source: Webhook Debug Active State: **\`${data.cmd.server[0].webhookactive}\`**`;

         serverTranslationStats =
               `**\`\`\`${data.message.channel.guild.name} - Server Tranlation Stats\`\`\`**\n` +
               `:bar_chart:  In total **\`${data.cmd.server[0].message}\`** messages in this server have been sent\n\n` +
               `:chart_with_upwards_trend:  RITA has translated **\`${data.cmd.server[0].translation}\`**  for this server\n\n` +
               `:frame_photo:  A total of **\`${data.cmd.server[0].images}\`**  images have been sent and **\`${data.cmd.server[0].gif}\`** Gif's have been shared\n\n` +
               `:flag_white:  **\`${data.cmd.server[0].react}\`**  messages have been translated with flag reactions \n\n` +
               `:notebook:  **\`${data.cmd.server[0].embedon}\`**  messages have been sent in **\`Embed On\`** format\n\n` +
               `:speech_balloon:  **\`${data.cmd.server[0].embedoff}\`**  messages have been sent in **\`Embed Off\`** format\n`;

      }

      data.color = "info";

      let debugStats = "";
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

         data.text = `${globalStats}\n\n${translationGlobalStats}`;

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
            `'UNREGISTERED'\n${
               data.message.channel.guild.name}\n${
               data.message.channel.guild.id}`
         );

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // Case: !t stats server
      if (data.cmd.params && data.cmd.params.toLowerCase().includes("server"))
      {

         data.text = `${serverStats}\n\n${serverTranslationStats}`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      if (data.cmd.params && data.cmd.params.toLowerCase().includes("debug"))
      {

         Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
         {

            if (data.message.isAdmin === false)
            {

               {

                  data.color = "warn";

               }
               data.text = ":cop:  This command is reserved for server adminis.";

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
            break Override;

         }

         data.text = debugStats;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      data.text = `${globalStats}\n\n${serverStats}`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   });

};
