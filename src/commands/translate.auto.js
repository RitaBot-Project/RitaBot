// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const botSend = require("../core/send");
const fn = require("../core/helpers");
const db = require("../core/db");
const logger = require("../core/logger");

// -------------------------------
// Auto translate Channel/Author
// -------------------------------

module.exports = function(data)
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

      return botSend(data);
   }

   // ----------------
   // Language checks
   // ----------------

   if (data.cmd.from === "auto" || data.cmd.from.valid.length !== 1)
   {
      data.color = "error";
      data.text =
         ":warning:  Auto Function Under Construction, Please use a defined language to translate from for now.";

      // -------------
      // Send message
      // -------------

      return botSend(data);
   }

   if (data.cmd.to.valid.length !== 1)
   {
      data.color = "error";
      data.text =
         ":warning:  Please specify one valid language for auto translation.";

      // -------------
      // Send message
      // -------------

      return botSend(data);
   }

   // ------------------
   // Prepare task data
   // ------------------

   data.task = {
      origin: data.message.channel.id,
      for: data.cmd.for,
      dest: [],
      invalid: [],
      from: data.cmd.from.valid[0].iso,
      to: data.cmd.to.valid[0].iso,
      server: data.message.guild.id,
      reply: data.message.guild.nameAcronym
   };

   // --------------------
   // log task data (dev)
   // --------------------

   logger("dev", data.task);

   // ------------------------------------------
   // Error if non-manager sets channel as dest
   // ------------------------------------------

   if (data.cmd.for[0] !== "me" && !data.message.isManager)
   {
      data.color = "error";
      data.text =
         ":cop:  You need to be a channel manager to " +
         "auto translate for others.";

      // -------------
      // Send message
      // -------------

      return botSend(data);
   }

   // -----------------------------------------------
   // Error if channel exceeds maximum allowed tasks
   // -----------------------------------------------

   db.getTasksCount(data.task.origin, function(err, res)
   {
      if (err)
      {
         logger("error", err);
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

         return botSend(data);
      }

      taskLoop();
   });

   // -------------------------------------------------
   // Resolve ID of each destiantion (user dm/channel)
   // -------------------------------------------------

   const taskLoop = function()
   {
      data.task.for.forEach(dest => //eslint-disable-line complexity
      {
         // resolve `me` / original message author

         if (dest === "me")
         {
            data.color = "error";
            data.text =
               ":warning: DM / User Translation Function Disabled";

            // -------------
            // Send message
            // -------------

            return botSend(data);

            // ---------------
            // Old Code Below
            // ---------------

            //taskBuffer.update("@" + data.message.author.id);
         }

         // resolve @everyone/@here

         if (dest === "@everyone" || dest === "@here")
         {
            taskBuffer.update(data.message.channel.id);
         }

         // resolve mentioned user(s)

         if (dest.startsWith("<@"))
         {
            data.color = "error";
            data.text =
               ":warning: DM / User Translation Function Disabled";

            // -------------
            // Send message
            // -------------

            return botSend(data);

            // ---------------
            // Old Code Below
            // ---------------

            /*
            const userID = dest.slice(3,-1);

            fn.getUser(data.client, userID, user =>
            {
               if (user && !user.bot && user.createDM)
               {
                  user.createDM().then(dm =>
                  {
                     taskBuffer.update(dm.id);
                  }).catch(err => logger("error", err));

                  taskBuffer.update("@" + user.id);
               }
               else
               {
                  data.task.invalid.push(dest);
                  taskBuffer.reduce();
               }
            });
            */
         }

         // resolve mentioned channel(s)

         if (dest.startsWith("<#"))
         {
            const channel = data.client.channels.get(dest.slice(2,-1));

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

         // invalid dests

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

   var taskBuffer = {
      len: data.task.for.length,
      dest: [],
      reduce: function()
      {
         this.len--;
         this.check();
      },
      update: function(dest)
      {
         this.dest.push(dest);
         this.check();
      },
      check: function()
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

   const validateTask = function()
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

         return botSend(data);
      }

      // ----------------------------------
      // Multiple dests set by non-manager
      // ----------------------------------

      if (data.task.dest.length > 1 && !data.message.isManager)
      {
         data.color = "error";
         data.text =
            ":cop::skin-tone-3:  You need to be a channel manager " +
            "to auto translate this channel for others.";

         // -------------
         // Send message
         // -------------

         return botSend(data);
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
      const forNames = data.cmd.for.join(",  ").replace(
         "me", `<@${data.message.author.id}>`
      );

      data.color = "ok";
      data.text =
         ":white_check_mark:  Automatically translating messages " +
         `from **\`${langFrom}\`** to **\`${langTo}\`** ` +
         `for ${forNames}.`;

      // -------------
      // Send message
      // -------------

      return botSend(data);
   };
};
