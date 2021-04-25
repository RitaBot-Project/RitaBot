// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
const colors = require("../../core/colors");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// -----------------------
// Command code
// -----------------------

module.exports.run = function(data)
{
   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   if (data.message.isAdmin === false)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server admins.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // --------------------------
   // If no new prefix is given
   // --------------------------

   if (!data.cmd.params)
   {
      const cmd = data.config.translateCmdShort;
      const object_prefix = db.server_obj[data.message.guild.id].db.prefix;
      if (cmd !== object_prefix && object_prefix !== "!tr")
      {
         data.color = "info";
         data.text = `:information_source: Your current prefix is: **\`${db.server_obj[message.guild.id].db.prefix}\`**\n\n`;
      }
      else
      {
         data.color = "info";
         data.text = `:information_source: Your current prefix is: **\`${cmd}\`**\n\n`;
      }

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // ----------------
   // Execute setting
   // ----------------

   if (data.message.isAdmin)
   {
      prefix(data);
   }
};


// -------------------------------
// prefix varible command handler
// -------------------------------

const prefix = function(data)
{
   const newPrefix = data.cmd.params.split(" ")[0].toLowerCase();

   if (newPrefix === "reset")
   {
      var reset = "!tr";
      console.log(newPrefix);
      return db.updatePrefix(
         data.message.channel.guild.id,
         reset, //This would be the new prefix
         function(err)
         {
            if (err)
            {
               return logger("error", err, "command", data.message.guild.name);
            }
            var outputvalid =
            "**```Command prefix has been reset```**\n" +
            `Your new prefix is **\`${reset}\`**. \n\n`;
            data.color = "info";
            data.text = outputvalid;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);
         }
      );
   }
   else if (newPrefix !== "")
   {
      console.log(newPrefix);
      return db.updatePrefix(
         data.message.channel.guild.id,
         newPrefix, //This would be the new prefix
         function(err)
         {
            if (err)
            {
               return logger("error", err, "command", data.message.guild.name);
            }
            var outputvalid =
            "**```New command prefix has been set```**\n" +
            `Your new prefix is **\`${newPrefix}\`**. \n\n`;
            data.color = "info";
            data.text = outputvalid;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);
         }
      );
   }

   data.color = "error";
   data.text =
      ":warning:  **`" + commandVariable1 +
      "`** is not a valid prefix option.\n";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);
};
