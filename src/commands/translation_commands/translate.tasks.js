// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const langCheck = require("../../core/lang.check");
const db = require("../../core/db");
const sendMessage = require("../../core/command.send");

// -----------------------
// Destination ID handler
// -----------------------

const destID = function destID (dest, author)
{

   if (dest.startsWith("<#"))
   {

      return dest.slice(
         2,
         -1
      );

   }
   if (dest.startsWith("<@"))
   {

      return dest.slice(
         1,
         -1
      );

   }
   if (dest === "me")
   {

      return `@${author}`;

   }
   return dest;

};

const destResolver = function destResolver (dest)
{

   if (!dest.startsWith("@"))
   {

      return `#${dest}`;

   }
   return dest;

};

// ---------------------
// Remove from database
// ---------------------

const shoutTasks = function shoutTasks (res, data,)
{

   data.color = "ok";
   data.text = ":negative_squared_cross_mark:  Translation tasks for this channel:";

   // -------------
   // Send message
   // -------------

   sendMessage(data);

   for (let i = 0, len = res.length; i < len; i += 1)
   {

      const task = res[i];
      const dest = destResolver(task.dest);
      const origin = destResolver(task.origin);
      const LangFrom = langCheck(task.LangFrom).valid[0].name;
      const LangTo = langCheck(task.LangTo).valid[0].name;
      data.text = `:arrow_right:   Translating **${LangFrom}** messages from **<${origin}>** and sending **${LangTo}** messages to **<${dest}>**`;

      // -------------
      // Send message
      // -------------

      sendMessage(data);

   }
   data.text = ":negative_squared_cross_mark:  That's all I have!";

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

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

// --------------------
// Handle stop command
// --------------------

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
   const dest = destID(
      data.cmd.for[0],
      data.message.author.id
   );
   const destDisplay = destResolver(
      data.cmd.for[0],
      data.message.author.id
   );

   // ------------------------------
   // Check if task actually exists
   // ------------------------------

   db.getTasks(
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

            const orig = destResolver(origin);
            data.color = "error";
            data.text =
            ":warning:  __**No tasks**__ for " +
            `**<${orig}>**.`;
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

         shoutTasks(
            res,
            data,
            origin,
            dest,
            destDisplay
         );

      }
   );

};
