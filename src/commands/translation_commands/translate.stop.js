// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// ---------------
// Database error
// ---------------

const dbError = function dbError (err, data)
{

   data.color = "error";
   data.text =
      ":warning:  Could not retrieve information from database. Try again " +
      "later or report this issue to an admin if problem continues.";

   // -------------
   // Send message
   // -------------

   sendMessage(data);
   return console.log(
      "error",
      err
   );

};

// ----------------------
// Remove from database
// ----------------------

const removeTask = function removeTask (res, data, origin, dest, destDisplay)
{

   db.removeTask(
      origin,
      dest,
      function error (err)
      {

         console.log("DEBUG: remoteTask()");
         if (err)
         {

            return dbError(
               err,
               data
            );

         }
         if (!isNaN(destDisplay))
         {

            // eslint-disable-next-line no-param-reassign
            destDisplay = `<@${destDisplay}>`;

         }
         data.color = "ok";
         data.text =
         `${":negative_squared_cross_mark:  Auto translation of this " +
         "channel has been stopped for **"}${destDisplay}**`;

         if (dest === "all")
         {

            data.text += ` (${res.length})`;

         }

         data.text += ".";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
   );

};

// ------------------------
// Destination ID handler
// ------------------------

const destID = function destID (dest, author)
{

   if (dest.startsWith("<#"))
   {

      return dest.slice(
         2,
         -1
      );

   }
   if (dest.startsWith("<@") && !dest.startsWith("<@!"))
   {

      return dest.slice(
         1,
         -1
      );

   }
   if (dest.startsWith("<@!"))
   {

      return dest.slice(
         3,
         -1
      );

   }
   if (dest === "me")
   {

      return `@${author}`;

   }
   if (!isNaN(dest))
   {

      return `@${dest}`;

   }

   return dest;

};

const destResolver = function destResolver (dest, author)
{

   if (dest === "me")
   {

      return `<@${author}>`;

   }
   return dest;

};

// ---------------------
// Handle stop command
// ---------------------

module.exports = function run (data)
{

   // -------------------------------------------------
   // Disallow this command in Direct/Private messages
   // -------------------------------------------------

   if (data.message.channel.type === "dm")
   {

      data.color = "warn";
      data.text =
         ":no_entry:  This command can only be called in server channels.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -------------------------------
   // Disallow multiple destinations
   // -------------------------------

   if (data.cmd.for.length > 1)
   {

      data.color = "error";
      data.text = ":warning:  Please specify only one `for` value.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -----------------------------------------
   // Disallow non-managers to stop for others
   // -----------------------------------------
   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.cmd.for[0] !== "me" && !data.message.isManager)
      {

         data.color = "error";
         data.text =
         ":cop:  You need to be a channel manager to stop auto translating " +
         "this channel for others.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
      break Override;

   }

   // ------------------
   // Prepare task data
   // ------------------

   const origin = data.message.channel.id;
   data.channel = data.message.channel;
   const dest = destID(
      data.cmd.for[0],
      data.message.author.id
   );
   let destDisplay = destResolver(
      data.cmd.for[0],
      data.message.author.id
   );

   // ------------------------------
   // Check if task actually exists
   // ------------------------------

   {

      db.checkTask(
         origin,
         dest,
         function error (err, res)
         {

            if (err)
            {

               return dbError(
                  err,
                  data
               );

            }

            // -----------------------------
            // Error if task does not exist
            // -----------------------------

            if (res.length < 1 || !res)
            {

               if (!isNaN(destDisplay))
               {

                  // eslint-disable-next-line no-param-reassign
                  destDisplay = `<@${destDisplay}>`;

               }
               data.color = "error";
               data.text =
            ":warning:  This channel is __**not**__ being translated for " +
            `**${destDisplay}**.`;

               if (dest === "all")
               {

                  data.text =
               ":warning:  This channel is not being automatically " +
               "translated for anyone.";

               }

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }

            // ------------------------------------------------
            // Otherwise, proceed to remove task from database
            // ------------------------------------------------

            removeTask(
               res,
               data,
               origin,
               dest,
               destDisplay
            );

         }
      );

   }

};
