// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-use-before-define */
/* eslint-disable vars-on-top */
/* eslint-disable sort-keys */
/* eslint-disable consistent-return */
const fn = require("../../core/helpers");
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");

// -------------------------------
// Auto translate Channel/Author
// -------------------------------

module.exports = function run (data)
{

   // -------------------------------------------------
   // Disallow this command in Direct/Private messages
   // -------------------------------------------------

   if (data.message.channel.type === "dm")
   {

      data.color = "error";
      data.text =
         ":no_entry:  This command can only be called in server channels.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Language checks
   // ----------------

   if (data.cmd.from.valid.length !== 1)
   {

      data.color = "error";
      data.text =
         ":warning:  Please use a defined `langFrom` language to translate from.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   if (data.cmd.to.valid.length !== 1 || data.cmd.to.valid[0] === "auto")
   {

      data.color = "error";
      data.text =
         ":warning:  Please use a defined `langTo` language to translate to.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ------------------
   // Prepare task data
   // ------------------

   data.task = {
      "origin": data.message.channel.id,
      "for": data.cmd.for,
      "dest": [],
      "invalid": [],
      "from": data.cmd.from.valid[0].iso,
      "to": data.cmd.to.valid[0].iso,
      "server": data.message.guild.id,
      "reply": data.message.guild.nameAcronym
   };

   // --------------------
   // Log task data (dev)
   // --------------------

   logger("dev", data.task);

   // ------------------------------------------
   // Error if non-manager sets channel as dest
   // ------------------------------------------
   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.cmd.for[0] !== "me" && !data.message.isManager)
      {

         data.color = "error";
         data.text =
         ":cop:  You need to be a channel manager to " +
         "auto translate for others.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
      break Override;

   }

   // -----------------------------------------------
   // Error if channel exceeds maximum allowed tasks
   // -----------------------------------------------

   db.getTasksCount(data.task.origin, function getTasksCount (err, res)
   {

      if (err)
      {

         logger("error", err, "command", data.message.channel.guild.name);

      }

      const taskCount = res[Object.keys(res)[0]];

      if (data.task.for.length + taskCount >= data.config.maxTasksPerChannel)
      {

         data.color = "error";
         data.text =
            ":no_entry:  Cannot add more auto-translation tasks for this " +
            `channel (${data.config.maxTasksPerChannel} max)`;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      taskLoop();

   });

   // -------------------------------------------------
   // Resolve ID of each destiantion (user dm/channel)
   // -------------------------------------------------

   const taskLoop = function taskLoop ()
   {

      data.task.for.forEach((dest) => // eslint-disable-line complexity
      {

         // Resolve `me` / original message author

         if (dest === "me")
         {

            // ---------------
            // Old Code Below
            // ---------------

            taskBuffer.update(`@${data.message.author.id}`);

         }

         // Resolve @everyone/@here

         if (dest === "@everyone" || dest === "@here")
         {

            taskBuffer.update(data.message.channel.id);

         }

         // Resolve mentioned user(s)

         if (dest.startsWith("<@"))
         {

            // ---------------
            // Old Code Below
            // ---------------


            const userID = dest.slice(3, -1);

            fn.getUser(data.client, userID, (user) =>
            {

               if (user && !user.bot && user.createDM)
               {

                  user.createDM().then((dm) =>
                  {

                     taskBuffer.update(dm.id);

                  }).
                     catch((err) => logger("error", err));

                  taskBuffer.update(`@${user.id}`);

               }
               else
               {

                  data.task.invalid.push(dest);
                  taskBuffer.reduce();

               }

            });

         }

         // Resolve mentioned channel(s)

         if (dest.startsWith("<#"))
         {

            const channel = data.client.channels.cache.get(dest.slice(2, -1));

            if (channel)
            {

               taskBuffer.update(channel.id);

            }
            else
            {

               data.task.invalid.push(dest);
               taskBuffer.reduce();

            }

         }

         // Invalid dests

         if (
            dest.startsWith("@") ||
            !dest.startsWith("<") && dest !== "me"
         )
         {

            data.task.invalid.push(dest);
            taskBuffer.reduce();

         }

      });

   };

   // ------------
   // Task buffer
   // ------------

   // eslint-disable-next-line no-var
   var taskBuffer = {
      "len": data.task.for.length,
      "dest": [],
      reduce ()
      {

         // eslint-disable-next-line no-plusplus
         this.len--;
         this.check();

      },
      update (dest)
      {

         this.dest.push(dest);
         this.check();

      },
      check ()
      {

         if (this.dest.length === this.len)
         {

            data.task.dest = fn.removeDupes(this.dest);
            data.task.invalid = fn.removeDupes(data.task.invalid);
            validateTask();

         }

      }
   };

   // --------------------------------------------
   // Validate Task(s) before sending to database
   // --------------------------------------------

   const validateTask = function validateTask ()
   {

      // --------------
      // Invalid dests
      // --------------

      if (data.task.invalid.length > 0)
      {

         data.color = "error";
         data.text = ":warning:  Invalid auto translation request.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ----------------------------------
      // Multiple dests set by non-manager
      // ----------------------------------
      Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
      {

         if (data.task.dest.length > 1 && !data.message.isManager)
         {

            data.color = "error";
            data.text =
            ":cop::skin-tone-3:  You need to be a channel manager " +
            "to auto translate this channel for others.";

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
         break Override;

      }

      // ---------------------
      // Add task to database
      // ---------------------

      db.addTask(data.task);

      // -------------------------
      // Send out success message
      // -------------------------

      const langFrom = data.cmd.from.valid[0].name;
      const langTo = data.cmd.to.valid[0].name;
      const forNames = data.cmd.for.join(",  ").replace("me", `<@${data.message.author.id}>`);

      data.color = "ok";
      data.text =
         ":white_check_mark:  Automatically translating messages " +
         `from **\`${langFrom}\`** to **\`${langTo}\`** ` +
         `for ${forNames}.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   };

};
