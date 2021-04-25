// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const logger = require("../../core/logger");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// ------------------------------
// Embed varible command handler
// ------------------------------

const embed = function embed (data)
{

   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "on" || commandVariable1 === "off")
   {

      console.log(`DEBUG: embed variable ${commandVariable1}`);
      return db.updateEmbedVar(
         data.message.channel.guild.id,
         commandVariable1,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "command",
                  data.message.channel.guild.name
               );

            }
            const output =
            "**```Embedded Translation```**\n" +
            `Embedded Message translation is now turned : ${commandVariable1}\n\n`;
            data.color = "info";
            data.text = output;

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
      }\`** is not a valid embed option.\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -------------
// Command Code
// -------------

module.exports = function run (data)

{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

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

   // --------------------------------
   // Error if embed param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `embed` parameter. Use `" +
         `${data.config.translateCmdShort} help embed\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return embed(data);

};


