// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");
const fs = require("fs");
const path = require("path");
const time = {
   "long": 10000,
   "short": 5000
};

// -------------------
// Available Settings
// -------------------

const getSettings = function getSettings (data)
{

   // ----------------------------
   // Set default server language
   // ----------------------------

   const setLang = function setLang (data)
   {

      // ---------------------------
      // Error for invalid language
      // ---------------------------

      if (data.cmd.to.valid.length !== 1)
      {

         data.color = "error";
         data.text = ":warning:  Please specify 1 valid language.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ------------------------
      // Error for same language
      // ------------------------

      if (data.cmd.server && data.cmd.to.valid[0].iso === data.cmd.server.lang)
      {

         data.color = "info";
         data.text =
            `:information_source:  **\`${
               data.cmd.to.valid[0].name}\`** is the current default ` +
            `languange of this server. To change:\n\`\`\`md\n# Example\n${
               data.config.translateCmd} settings setLang to french\n\`\`\``;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ----------------
      // Update database
      // ----------------

      return db.updateServerLang(
         data.message.channel.guild.id,
         data.cmd.to.valid[0].iso,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "db",
                  data.message.channel.guild.name
               );

            }
            data.color = "ok";
            data.text =
               `Default language for server has been changed to **\`${
                  data.cmd.to.valid[0].name}\`**.`;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   };

   // -------------
   // List Servers
   // -------------

   const listServers = function listServers (data)
   {

      data.text = "Active Servers - ";

      const activeGuilds = data.client.guilds.cache.array();

      data.text += `${activeGuilds.length}\n\n`;

      activeGuilds.forEach((guild) =>
      {

         data.text += `${guild.name}\n${guild.id}\n${guild.memberCount} members\n`;
         if (guild.owner)
         {

            data.text += `${guild.owner.user.username}#`;
            data.text += `${guild.owner.user.discriminator}\n\n`;

         }
         else
         {

            data.text += "\n";

         }

      });

      // ------------------
      // Send message/file
      // ------------------

      data.message.delete({"timeout": time.short}).catch((err) => console.log(
         "Command Message Deleted Error, command.send.js = ",
         err
      ));
      fs.writeFileSync(
         path.resolve(
            __dirname,
            "../../files/serverlist.txt"
         ),
         data.text
      );
      data.message.channel.send(
         "Server List.",
         {"files": ["./src/files/serverlist.txt"]}
      );

   };


   // -----------
   // Update bot
   // -----------

   const updateBot = function updateBot (data)
   {

      // Const activeGuilds = data.client.guilds.array();
      // Data.color = "info";
      // Data.text = `Updating bot for **${activeGuilds.length}** servers.`;
      // Return sendMessage(data);
      //
      // ActiveGuilds.forEach(guild =>
      // {
      //   Guild.owner.send(
      //   "Hello, this bot has been updated to a new version.\n " +
      //   "More info: https://ritabot.gg/whats-new/#new-in-121\n");
      // });
      data.message.delete({"timeout": time.short}).catch((err) => console.log(
         "UpdateBot Command Message Deleted Error, command.send.js = ",
         err
      ));
      return data.message.channel.send({"embed": {
         "author": {
            "icon_url": data.client.user.displayAvatarURL(),
            "name": data.client.user.username
         },
         "color": 13107200,
         "description": ":no_entry_sign: This command has been disabled"

      }}).then((msg) =>
      {

         msg.delete({"timeout": time.long}).catch((err) => console.log(
            "UpdateBot Bot Message Deleted Error, settings.js = ",
            err
         ));

      });

   };

   // -----------------
   // DM server owners
   // -----------------
   // Announcements not possible until D.js v12

   /*
   Const announcement = async function(data)
   {
      const guildArray = Array.from(bot.client.guilds.values());
      var i;
      for (i = 0; i < guildArray.length; i += 1)
      {
         console.log("Hello");
         const guild = await guildArray[i];
         var owner = await guild.ownerID;
         // eslint-disable-next-line quotes
         owner = Number(owner)
         // eslint-disable-next-line no-undef
         owner = owner.replace(/([0-9]+)/g, "$1");
         console.log("Done");
         await data.client.users.get(owner).send("Testing").catch((err) =>
         {
            console.log(err);
         });
      }
   };
   */

   // ----------
   // Update db
   // ----------

   function updateDB (data)
   {

      data.color = "info";
      data.text =
         ":white_check_mark: **Database has been updated.**";

      // -------------
      // Send message
      // -------------

      db.updateColumns();

      return sendMessage(data);

   }

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validSettings = {
   // "announcement": announcement,
      "listservers": listServers,
      "setlang": setLang,
      "updatebot": updateBot,
      "updatedb": updateDB
   };

   const settingParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validSettings,
      settingParam
   ))
   {

      return validSettings[settingParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params
      }\`** is not a valid settings option.`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (!process.env.DISCORD_BOT_OWNER_ID)
   {

      data.color = "warn";
      data.text = `:warning: These command can cause issues with your bot, as a extra layer of security they have been restricted further than discord admins.\n\n ` +
      ` If you are trying to run the \`settings dbfix\` or \`settings uppdatedb\` commands then you do not need to do this anymore when updating the bot. \n\n ` +
      ` If however you want access to these commands then please set \`DISCORD_BOT_OWNER_ID\` as an array of User IDs, include any user that is allowed to use these command in configuration vars. \n\n **Ex.** \`\`\`js\nDISCORD_BOT_OWNER_ID=[ALLOWED_USER_1_ID, ALLOWED_USER_2_ID, ALLOWED_USER_3_ID]\`\`\`\n ` +
      ` Copy the above in to your .env file (local hosting) or environment variables (Heroku) .`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      data.color = "warn";
      data.text = ":warning: These Commands are for developers only.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `settings` parameter. Use `" +
         `${data.config.translateCmdShort} help settings\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return getSettings(data);

};
