// -----------------
// Global variables
// -----------------

//  Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const fn = require("../../core/helpers");
const translate = require("../../core/translate");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");
const time = {
   "long": 10000,
   "short": 5000
};

// -----------------------------
// Command Disabled Pending Fix
// -----------------------------

module.exports.run = function run (data)
{


   data.message.delete({"timeout": time.short}).catch((err) => console.log(
      "Command Message Deleted Error, command.send.js = ",
      err
   ));
   return data.message.channel.send({"embed": {
      "author": {
         "icon_url": data.client.user.displayAvatarURL(),
         "name": data.client.user.username
      },
      "color": 13107200,
      "description": `:no_entry_sign: This command has been disabled Pending a fix \n
     We apologise for any inconvenience this may cause.`

   }}).then((msg) =>
   {

      msg.delete({"timeout": time.long}).catch((err) => console.log(
         "UpdateBot Bot Message Deleted Error, settings.js = ",
         err
      ));

   });

};


const getCount = function getCount (count)
{

   if (count)
   {

      return count;

   }
   return "-1";

};

// ---------------
// Translate last
// ---------------

module.exports.old = function old (data)
{

   // -------------------------
   // Prepare translation data
   // -------------------------

   data.translate = {
      "from": data.cmd.from,
      "to": data.cmd.to

   };

   // ----------------
   // Get count param
   // ----------------

   let count = getCount(data.cmd.num);

   // ---------
   // Set mode
   // ---------

   let mode = "all";

   if (count.startsWith("-") || count === "1")
   {

      mode = "single";
      data.translate.multi = true;

   }

   if (mode === "all" && Math.abs(count) > data.config.maxChains)
   {

      data.color = "warn";
      data.text =
            `:warning:  Cannot translate more than __**\`${
               data.config.maxChains}\`**__ message chains at once.`;

      // -------------
      // Send message
      // -------------

      sendMessage(data);
      count = data.config.maxChains;

   }

   // -------------------------
   // Get requested collection
   // -------------------------

   let limit = Math.abs(count) * data.config.maxChainLen + 1;

   if (limit > 100)
   {

      limit = 100;

   }

   data.message.channel.messages.fetch({
      limit
   }).then((messages) =>
   {

      const messagesArray = messages.array().reverse();
      let lastAuthor = null;
      const chains = [];

      for (let i = 0; i < messagesArray.length; i += 1)
      {

         if (
            !messagesArray[i].author.bot &&
            !messagesArray[i].content.startsWith(data.config.translateCmdShort)
         )
         {

            if (
               lastAuthor === messagesArray[i].author.id &&
               chains[chains.length - 1].msgs.length < data.config.maxChainLen
            )
            {

               chains[chains.length - 1].msgs.push(messagesArray[i].content);

            }

            else
            {

               chains.push({
                  "author": messagesArray[i].author,
                  "color": fn.getRoleColor(messagesArray[i].member),
                  "id": [messagesArray[i].id],
                  "msgs": [messagesArray[i].content],
                  "time": messagesArray[i].createdTimestamp
               });
               lastAuthor = messagesArray[i].author.id;

            }

         }

      }

      // --------------------------
      // Get requested chains only
      // --------------------------

      const reqChains = chains.slice(-Math.abs(count));

      // --------------------------
      // Error - No messages found
      // --------------------------

      if (reqChains.length < 1)
      {

         data.color = "warn";
         data.text =
            ":warning:  Could not find any valid messages to " +
            "translate. Bots and commands are ignored.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // -----------------------
      // Translate single chain
      // -----------------------

      if (mode === "single")
      {

         data.message.author = reqChains[0].author;
         data.translate.original = reqChains[0].msgs.join("\n");
         data.message.guild.id = reqChains[0].id;
         delete data.message.attachments;
         return translate(data);

      }

      // -----------------------------------
      // Translate multiple chains (buffer)
      // -----------------------------------

      data.bufferChains = reqChains;
      delete data.message.attachments;
      return translate(data);

   }).
      catch((err) => logger(
         "error",
         err,
         "command",
         data.message.guild.name
      ));

};

