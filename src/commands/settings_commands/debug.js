/* eslint-disable vars-on-top */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");

// -----------------
// Webhook Creation
// -----------------

// eslint-disable-next-line no-unused-vars
const webhook = async function webhook (chan)
{

   await chan.createWebhook("Rita Diagnostic Tool", {
      "avatar": "https://ritabot.gg/assets/images/favicon.png"
   }).
      then((webhook) => console.log(`Created webhook ${webhook}`)).
      catch(console.error);

};

// -------------------------------
// Debug varible command handler
// -------------------------------

const debuging = async function debuging (data)
{

   const webhookIDVar = data.cmd.server[0].webhookid;
   const webhookTokenVar = data.cmd.server[0].webhooktoken;
   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on")
   {

      console.log("Debug on 1");
      // Checks if there iS an item in the channels collection that corresponds with the supplied parameters, returns a boolean
      const check = (element) => element.name === "ritabot-debug";
      Setup:if (webhookIDVar !== process.env.DISCORD_DEBUG_WEBHOOK_ID)
      {

         if (process.env.DISCORD_DEBUG_WEBHOOK_ID === "")
         {

            break Setup;

         }
         data.color = "info";
         data.text = "```Webhook Debuging has already been set up.```";
         return sendMessage(data);

      }
      if (data.message.guild.channels.cache.some(check))
      {

         data.color = "info";
         data.text = "```Debug status is already on.\nFor Heroku users this is only for 24 hours,\nor until the next automatic restart.```";

         process.env.DISCORD_DEBUG_WEBHOOK_ID = webhookIDVar;
         process.env.DISCORD_DEBUG_WEBHOOK_TOKEN = webhookTokenVar;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);


      }

      console.log("Debug on 3");
      // Create a new channel with permission overwrites
      await data.message.guild.channels.create("ritabot-debug", {
         "permissionOverwrites": [
            {
               "deny": ["VIEW_CHANNEL"],
               "id": data.message.guild.id
            }
         ],
         "type": "text"
      });

      console.log("Debug on 4");
      const chan = data.message.guild.channels.cache.find((channel) => channel.name === "ritabot-debug");
      console.log(`DEBUG: Chan ID ${chan}`);
      await webhook(chan);

      const hooks = await chan.fetchWebhooks();
      const webhookValue = hooks.find((webhook) => webhook.name === "Rita Diagnostic Tool");
      console.log(`The ID is  ${webhookValue.id}`);
      console.log(`The Token is  ${webhookValue.token}`);

      console.log(`DEBUG: debug variable ${commandVariable1}`);
      return db.updateWebhookVar(
         data.message.channel.guild.id,
         // This would be the Webhook ID
         webhookValue.id,
         // This would be the Webhook Token
         webhookValue.token,
         true,
         function error (err)
         {

            if (err)
            {

               return logger("error", err, "command", data.message.channel.guild.name);

            }
            const outputgh =
            "**```Start Debug mode```**\n" +
            `Debug mode has been Started. \n` +
            `Error Logs will be output to this channel.\n\n` +
            `For Heroku users this is only for 24 hours, \n` +
            `or until the next automatic restart. \n`;
            data.color = "info";
            data.text = outputgh;

            // -------------
            // Send message
            // -------------

            if (!process.env.DISCORD_DEBUG_WEBHOOK_ID)
            {

               process.env.DISCORD_DEBUG_WEBHOOK_ID = webhookValue.id;
               process.env.DISCORD_DEBUG_WEBHOOK_TOKEN = webhookValue.token;

            }


            return sendMessage(data);

         }
      );

   }
   else if (commandVariable1 === "off")
   {

      console.log(`DEBUG: debug variable ${commandVariable1}`);
      return db.removeWebhook(
         data.message.channel.guild.id,
         function error (err)
         {

            if (err)
            {

               return logger("error", err, "command", data.message.channel.guild.name);

            }
            const outputoc =
          "**```Stop Debug mode```**\n" +
          `Debug mode has been Stopped. \n` +
          `Error logs will not be shown.\n\n`;
            data.color = "info";
            data.text = outputoc;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }

   data.color = "error";
   data.text =
      `:warning:  **\`${commandVariable1
      }\`** is not a valid debug option.\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----------------------
// Command code
// -----------------------

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      data.color = "warn";
      data.text = ":cop:  This command is reserved for bot owners.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }
   // --------------------------------
   // Error if debug param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `debug` parameter. Use `" +
         `${data.config.translateCmdShort} help debug\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return debuging(data);

};
