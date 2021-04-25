// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const discord = require("discord.js");
const auth = require("./auth");
const colors = require("./colors").get;
const spacer = "​                                                          ​";

const hook = new discord.WebhookClient(
   auth.loggerWebhookID, auth.loggerWebhookToken
);

// ------------
// logger code
// ------------

module.exports = function(type, data, subtype = null, id = "Unknown")
{
   if (hook.id === undefined)
   {
      return;
   }
   const logTypes = {
      dev: devConsole,
      error: errorLog,
      warn: warnLog,
      custom: hookSend,
      guildJoin: logJoin,
      guildLeave: logLeave
   };

   //if (logTypes.hasOwnProperty(type))
   if (Object.prototype.hasOwnProperty.call(logTypes,type))
   {
      return logTypes[type](data, subtype, id);
   }
};

// --------------------
// Log data to console
// --------------------

const devConsole = function(data)
{
   if (auth.dev)
   {
      return console.log(data);
   }
};

// ------------
// Hook Sender
// ------------

const hookSend = function(data)
{
   const embed = new discord.RichEmbed({
      title: data.title,
      color: colors(data.color),
      description: data.msg,
      footer: {
         text: data.footer
      }
   });
   hook.send(embed).catch(err =>
   {
      console.error("hook.send error:\n" + err);
   });
};

// -------------
// Error Logger
// -------------

const errorLog = function(error, subtype, id)
{
   let errorTitle = null;

   const errorTypes = {
      dm: ":skull_crossbones:  Discord - user.createDM",
      fetch: ":no_pedestrians:  Discord - client.fetchUser",
      send: ":postbox:  Discord - send",
      edit: ":crayon:  Discord - message.edit",
      react: ":anger:  Discord - message.react",
      typing: ":keyboard:  Discord - channel.startTyping",
      presence: ":loudspeaker:  Discord - client.setPresence",
      db: ":outbox_tray:  Database Error",
      uncaught: ":japanese_goblin:  Uncaught Exception",
      unhandled: ":japanese_ogre:  Unhandled promise rejection",
      warning: ":exclamation:  Process Warning",
      api: ":boom:  External API Error",
      discord: ":notepad_spiral: DiscordAPIError: Unknown Message",
      command: ":chains: Command Error",
      shardFetch: ":pager:  Discord - shard.fetchClientValues"
   };

   //if (errorTypes.hasOwnProperty(subtype))
   if (Object.prototype.hasOwnProperty.call(errorTypes,subtype))
   {
      errorTitle = errorTypes[subtype];
   }

   hookSend({
      title: errorTitle,
      color: "err",
      // eslint-disable-next-line no-useless-concat
      msg: "```json\n" + error.toString() + "\n" + error.stack + "\n\n" + "Error originated from server: " + id + "```"
   });
};

// ----------------
// Warnings Logger
// ----------------

const warnLog = function(warning)
{
   hookSend({
      color: "warn",
      msg: warning
   });
};

// ---------------
// Guild Join Log
// ---------------

const logJoin = function(guild)
{
   hookSend({
      color: "ok",
      title: "Joined Guild",
      msg:
         `:white_check_mark:  **${guild.name}**\n` +
         "```md\n> " + guild.id + "\n@" + guild.owner.user.username + "#" +
         guild.owner.user.discriminator + "\n```" + spacer + spacer
   });
};

// ----------------
// Guild Leave Log
// ----------------

const logLeave = function(guild)
{
   hookSend({
      color: "warn",
      title: "Left Guild",
      msg:
         `:regional_indicator_x:  **${guild.name}**\n` +
         "```md\n> " + guild.id + "\n@" + guild.owner.user.username + "#" +
         guild.owner.user.discriminator + "\n```" + spacer + spacer
   });
};
