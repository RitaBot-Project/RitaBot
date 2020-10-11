// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const botSend = require("../core/send");
const db = require("../core/db");

// ---------------------
// Handle stop command
// ---------------------

module.exports = function(data)
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

      return botSend(data);
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

      return botSend(data);
   }

   // -----------------------------------------
   // Disallow non-managers to stop for others
   // -----------------------------------------

   if (data.cmd.for[0] !== "me" && !data.message.isManager)
   {
      data.color = "error";
      data.text =
         ":cop:  You need to be a channel manager to stop auto translating " +
         "this channel for others.";

      // -------------
      // Send message
      // -------------

      return botSend(data);
   }

   // ------------------
   // Prepare task data
   // ------------------

   const origin = data.message.channel.id;
   const dest = destID(data.cmd.for[0], data.message.author.id);
   const destDisplay = destResolver(data.cmd.for[0], data.message.author.id);

   // ------------------------------
   // Check if task actually exists
   // ------------------------------

   db.checkTask(origin, dest, function(err, res)
   {
      if (err)
      {
         return dbError(err, data);
      }

      // -----------------------------
      // Error if task does not exist
      // -----------------------------

      if (res.length < 1 || !res)
      {
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

         return botSend(data);
      }

      // ------------------------------------------------
      // Otherwise, proceed to remove task from database
      // ------------------------------------------------

      removeTask(res, data, origin, dest, destDisplay);
   });
};

// ----------------------
// Remove from database
// ----------------------

const removeTask = function(res, data, origin, dest, destDisplay)
{
   db.removeTask(origin, dest, function(err)
   {
      console.log("remoteTask()");
      if (err)
      {
         return dbError(err, data);
      }

      data.color = "ok";
      data.text =
         ":negative_squared_cross_mark:  Auto translation of this " +
         "channel has been stopped for **" + destDisplay + "**";

      if (dest === "all")
      {
         data.text += ` (${res.length})`;
      }

      data.text += ".";

      // -------------
      // Send message
      // -------------

      return botSend(data);
   });
};

// ------------------------
// Destination ID handler
// ------------------------

const destID = function(dest, author)
{
   if (dest.startsWith("<#"))
   {
      return dest.slice(2,-1);
   }
   if (dest.startsWith("<@"))
   {
      return dest.slice(1,-1);
   }
   if (dest === "me")
   {
      return "@" + author;
   }
   return dest;
};

const destResolver = function(dest, author)
{
   if (dest === "me")
   {
      return "<@" + author + ">";
   }
   return dest;
};

// ---------------
// Database error
// ---------------

const dbError = function(err, data)
{
   data.color = "error";
   data.text =
      ":warning:  Could not retrieve information from database. Try again " +
      "later or report this issue to an admin if problem continues.";

   // -------------
   // Send message
   // -------------

   botSend(data);
   return console.log("error", err);
};
