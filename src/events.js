// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const stripIndent = require("common-tags").stripIndent;
const oneLine = require("common-tags").oneLine;
const auth = require("./core/auth");
const logger = require("./core/logger");
const messageHandler = require("./message");
const db = require("./core/db");
// Const setStatus = require("./core/status");
const react = require("./commands/translation_commands/translate.react");
const botVersion = require("../package.json").version;
const botCreator = "Collaboration";

// ----------
// Core Code
// ----------

exports.listen = function listen (client)
{

   let config = null;

   // -----------------
   // Client Connected
   // -----------------

   client.on(
      "ready",
      async () =>
      {

         await db.initializeDatabase(client);

         // -----------------
         // Default Settings
         // -----------------

         config = {
            "botServer": "https://discord.gg/mgNR64R",
            "defaultLanguage": "en",
            "inviteURL": auth.invite || "Set this in your .env file / config variables in Heroku",
            "maxChainLen": 5,
            "maxChains": 10,
            "maxEmbeds": 5,
            "maxMulti": 6,
            "maxTasksPerChannel": 10,
            "owner": auth.botOwner,
            "translateCmd": "!translate",
            "translateCmdShort": "!tr",
            "version": botVersion
         };

         if (!process.env.DISCORD_BOT_OWNER_ID)
         {

            process.env.DISCORD_BOT_OWNER_ID = [];

         }

         let shard = client.shard;

         if (!shard)
         {

            shard = {
               "count": 1,
               "id": 0
            };

         }

         if (shard.id === 0)
         {

            console.log(stripIndent`
            ----------------------------------------
            @${client.user.username} Bot is now online
            V.${config.version} | ID: ${client.user.id}
            Made by: ${botCreator}
            ----------------------------------------
         `);

         }

         console.log(oneLine`
         Shard#${shard.id}:  ${shard.id + 1} / ${shard.count} online -
         ${client.guilds.cache.size.toLocaleString()} guilds,
         ${client.channels.cache.size.toLocaleString()} channels,
         ${client.users.cache.size.toLocaleString()} users
      `);

         client.user.setPresence({
            "activity": {
               "name": "ritabot.gg | !tr help",
               "type": "PLAYING"
            },
            "status": "online"
         });

         // ----------------------
         // All shards are online
         // ----------------------

         if (shard.id === shard.count - 1)
         {

            // ---------------------
            // Log connection event
            // ---------------------

            console.log(stripIndent`
            ----------------------------------------
            All shards are online, running intervals
            ----------------------------------------
         `);

            logger(
               "custom",
               {
                  "color": "ok",
                  "msg": oneLine`
               :wave:  **${client.user.username}**
               is now online - \`v.${botVersion}\` -
               **${shard.count}** shards
            `
               }
            );

         }

      }
   );

   // -----------------
   // Recieved Message
   // -----------------

   client.on(
      "message",
      (message) =>
      {

         if (message.channel.type !== "dm")
         {

            if (db.server_obj[message.guild.id])
            {

               if (config.translateCmdShort !== db.server_obj[message.guild.id].db.prefix)
               {

                  config.translateCmdShort = db.server_obj[message.guild.id].db.prefix;

               }
               // SetStatus(client.user, "online", config);

            }
            if (!message.author.bot)
            {

               console.log(`${message.guild.name} - ${message.guild.id} - ${message.createdAt}`);
               const col = "message";
               let id = "bot";
               db.increaseStatsCount(col, id);

               if (message.channel.type === "text")
               {

                  id = message.channel.guild.id;

               }

               db.increaseStatsCount(col, id);
               // Need to have another if statment here, if server length is greeater than 1 then run below, if not do nothing.
               // SetStatus(client.user, "online", config);

            }

         }

         messageHandler(
            config,
            message
         );

      }
   );

   // -----------------------------------------------------------
   //  Message edit, Will be fully implemented in future release
   // -----------------------------------------------------------

   // Client.on("messageUpdate", (oldMessage, newMessage) =>
   // {
   //   MessageHandler(config, oldMessage, newMessage);
   // });

   // ---------------
   // Message delete
   // ---------------

   // Client.on("messageDelete", (message) =>
   // {
   //   MessageHandler(config, message, null, true);
   // });

   // -----------
   // Raw events
   // -----------
   client.on(
      "raw",
      (raw) =>
      {

         // ---------------------
         // Listen for reactions
         // ---------------------

         if (raw.t === "MESSAGE_REACTION_ADD")
         {

            react(
               raw.d,
               client
            );

         }

      }
   );

   // ---------------------------
   // Log Client Errors/Warnings
   // ---------------------------

   client.on(
      "error",
      (err) => logger(
         "error",
         err
      )
   );

   client.on(
      "warning",
      (info) => logger(
         "warn",
         info
      )
   );

   client.on(
      "disconnect",
      (event) => logger(
         "error",
         event
      )
   );

   // ------------------------
   // Proccess-related errors
   // ------------------------

   process.on(
      "uncaughtException",
      (err) =>
      {

         logger(
            "dev",
            err
         );
         return logger(
            "error",
            err,
            "uncaught"
         );

      }
   );

   process.on(
      "unhandledRejection",
      (reason) =>
      {

         const err = `${`Unhandled Rejection` +
           `\nCaused By:\n`}${reason.stack}`;
         logger(
            "dev",
            err
         );
         return logger(
            "error",
            err,
            "unhandled"
         );

      }
   );

   process.on(
      "warning",
      (warning) =>
      {

         logger(
            "dev",
            warning
         );
         return logger(
            "error",
            warning,
            "warning"
         );

      }
   );

   // ---------------------------
   // Delete/leave/change events
   // ---------------------------

   client.on(
      "channelDelete",
      (channel) =>
      {

         db.removeTask(
            channel.id,
            "all",
            // eslint-disable-next-line consistent-return
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err
                  );

               }

            }
         );

      }
   );

   client.on(
      "guildDelete",
      (guild) =>
      {

         logger(
            "guildLeave",
            guild
         );
         db.removeServer(guild.id);

      }
   );

   client.on(
      "guildUnavailable",
      (guild) => logger(
         "warn",
         `Guild unavailable: ${guild.id}`
      )
   );

   // -----------
   // Guild join
   // -----------

   client.on(
      "guildCreate",
      (guild) =>
      {

         logger(
            "guildJoin",
            guild
         );
         db.addServer(
            guild.id,
            config.defaultLanguage,
            db.Servers
         );

      }
   );

};
