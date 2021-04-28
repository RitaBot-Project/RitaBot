/* eslint-disable no-bitwise */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const discord = require("discord.js");
const auth = require("./auth");
const colors = require("./colors").get;
const spacer = "​                                                          ​";

// --------------------
// Log data to console
// --------------------

const devConsole = function devConsole (data)
{

   if (auth.dev)
   {

      return console.log(data);

   }

};

// ------------
// Hook Sender
// ------------

const hookSend = function hookSend (data)
{

   const hook = new discord.WebhookClient(
      process.env.DISCORD_DEBUG_WEBHOOK_ID,
      process.env.DISCORD_DEBUG_WEBHOOK_TOKEN
   );
   const embed = new discord.MessageEmbed({
      "color": colors(data.color),
      "description": data.msg,
      "footer": {
         "text": data.footer
      },
      "title": data.title
   });
   hook.send(embed).catch((err) =>
   {

      console.error(`hook.send error:\n${err}`);

   });

};

// -------------
// Error Logger
// -------------

const errorLog = function errorLog (error, subtype, id)
{

   let errorTitle = null;

   const errorTypes = {
      "api": ":boom:  External API Error",
      "command": ":chains: Command Error",
      "db": ":outbox_tray:  Database Error",
      "discord": ":notepad_spiral: DiscordAPIError: Unknown Message",
      "dm": ":skull_crossbones:  Discord - user.createDM",
      "edit": ":crayon:  Discord - message.edit",
      "fetch": ":no_pedestrians:  Discord - client.users.fetch",
      "presence": ":loudspeaker:  Discord - client.setPresence",
      "react": ":anger:  Discord - message.react",
      "send": ":postbox:  Discord - send",
      "shardFetch": ":pager:  Discord - shard.fetchClientValues",
      "typing": ":keyboard:  Discord - channel.startTyping",
      "uncaught": ":japanese_goblin:  Uncaught Exception",
      "unhandled": ":japanese_ogre:  Unhandled promise rejection",
      "warning": ":exclamation:  Process Warning"
   };

   // If (errorTypes.hasOwnProperty(subtype))
   if (Object.prototype.hasOwnProperty.call(
      errorTypes,
      subtype
   ))
   {

      errorTitle = errorTypes[subtype];

   }

   hookSend({
      "color": "err",
      // eslint-disable-next-line no-useless-concat
      "msg": `\`\`\`json\n${error.toString()}\n${error.stack}\n\n` + `Error originated from server: ${id}\`\`\``,
      "title": errorTitle
   });

};

// ----------------
// Warnings Logger
// ----------------

const warnLog = function warnLog (warning)
{

   hookSend({
      "color": "warn",
      "msg": warning
   });

};

// ---------------
// Guild Join Log
// ---------------

const logJoin = function logJoin (guild)
{

   if (guild.owner)
   {

      hookSend({
         "color": "ok",
         "msg":
         `${`:white_check_mark:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n@${guild.owner.user.username}#${
            guild.owner.user.discriminator}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Joined Guild"

      });

   }
   else
   {

      hookSend({
         "color": "ok",
         "msg":
         `${`:white_check_mark:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n${guild.memberCount} members#\n\`\`\`${spacer}${spacer}`,
         "title": "Joined Guild"

      });

   }

};

// ----------------
// Guild Leave Log
// ----------------

const logLeave = function logLeave (guild)
{

   if (guild.owner)
   {

      hookSend({
         "color": "warn",
         "msg":
         `${`:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n@${guild.owner.user.username}#${
            guild.owner.user.discriminator}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Left Guild"
      });

   }
   else
   {

      hookSend({
         "color": "warn",
         "msg":
         `${`:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> "}${guild.id}\n${guild.memberCount} members\n\`\`\`${spacer}${spacer}`,
         "title": "Left Guild"
      });

   }

};

// ------------
// Logger code
// ------------

// eslint-disable-next-line default-param-last
module.exports = function run (type, data, subtype = null, id)
{

   if (process.env.DISCORD_DEBUG_WEBHOOK_ID === undefined)
   {

      return;

   }
   const logTypes = {
      "custom": hookSend,
      "dev": devConsole,
      "error": errorLog,
      "guildJoin": logJoin,
      "guildLeave": logLeave,
      "warn": warnLog
   };

   // If (logTypes.hasOwnProperty(type))
   if (Object.prototype.hasOwnProperty.call(
      logTypes,
      type
   ))
   {

      if (data.message !== undefined)
      {

         if (data.message.guild !== undefined)

         {

            console.log("Has guild");
            const id = data.message.guild.name;
            return logTypes[type](
               data,
               subtype,
               id
            );

         }

         console.log("Has Message");

      }

      console.log("Has");

      return logTypes[type](
         data,
         subtype,
         id
      );

   }

};
