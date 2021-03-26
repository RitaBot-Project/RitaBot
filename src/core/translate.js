// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const translate = require("google-translate-api");
const db = require("./db");
const botSend = require("./send");
const fn = require("./helpers");

// ------------------------------------------
// Fix broken Discord tags after translation
// (Emojis, Mentions, Channels)
// ------------------------------------------


const translateFix = function(string)
{
   const normal = /(<[@#!$%&*])\s*/gim;
   const nick = /(<[@#!$%&*]!)\s*/gim;
   const role = /(<[@#!$%&*]&)\s*/gim;

   return string.replace(normal, "$1")
      .replace(nick, "$1")
      .replace(role, "$1");
};

// ---------------------------------------
// Get user color for translated response
// ---------------------------------------

function getUserColor(data, callback)
{
   const fw = data.forward;
   const txt = data.text;
   const ft = data.footer;
   const usr = data.author;

   data.forward = fw;
   data.text = txt;
   data.footer = ft;
   data.author = usr;

   callback(data);
}



// --------------------------
// Translate buffered chains
// --------------------------

const bufferSend = function(arr, data)
{
   const sorted = fn.sortByKey(arr, "time");
   sorted.forEach(msg =>
   {
      data.text = msg.text;
      data.color = msg.color;
      data.author = msg.author;
      data.showAuthor = true;

      // -------------
      // Send message
      // -------------

      botSend(data);
   });
};

const bufferChains = function(data, from)
{
   var translatedChains = [];

   data.bufferChains.forEach(chain =>
   {
      const chainMsgs = chain.msgs.join("\n");
      const to = data.translate.to.valid[0].iso;

      translate(chainMsgs, {
         to: to,
         from: from
      }).then(res =>
      {
         const langTo = res.raw[1][4][2]; // Language you set it to translate to when setting up !t channel command
         const detectedLang = res.from.language.iso; // Detected language from text
         const channelFrom = from; // Language you set when setting up !t channel command
         if (detectedLang === langTo)
         {
            return;
         } else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {
            return;
         }

         const output = translateFix(res.text);

         getUserColor(chain, function(gotData)
         {
            translatedChains.push({
               time: chain.time,
               color: gotData.color,
               author: gotData.author,
               text: output
            });

            if (fn.bufferEnd(data.bufferChains, translatedChains))
            {
               bufferSend(translatedChains, data);
            }
         });
      });
   });
};

// ---------------------
// Invalid lang checker
// ---------------------

const invalidLangChecker = function(obj, callback)
{
   if (obj && obj.invalid && obj.invalid.length > 0)
   {
      return callback();
   }
};

// --------------------
// Update server stats
// --------------------

const updateServerStats = function(message)
{
   var id = "bot";

   if (message.channel.type === "text")
   {
      id = message.channel.guild.id;
   }

   db.increaseServers(id);
};

// ----------------
// Run translation
// ----------------

module.exports = function(data) //eslint-disable-line complexity
{
   // -------------------
   // Get message author
   // -------------------
   // global.data.message = data.message

   data.author = data.message.author;

   // -------------------------
   // Report invalid languages
   // -------------------------

   invalidLangChecker(data.translate.from, function()
   {
      data.color = "warn";
      data.text = ":warning:  Cannot translate from `" +
                  data.translate.from.invalid.join("`, `") + "`.";

      // -------------
      // Send message
      // -------------

      botSend(data);
   });

   invalidLangChecker(data.translate.to, function()
   {
      data.color = "warn";
      data.text = ":warning:  Cannot translate to `" +
                  data.translate.to.invalid.join("`, `") + "`.";

      // -------------
      // Send message
      // -------------

      botSend(data);
   });

   // -------------------------------------
   // Stop if there are no valid languages
   // -------------------------------------

   if (
      data.translate.to.valid.length < 1 ||
      data.translate.from.valid && data.translate.from.valid.length < 1
   )
   {
      return;
   }

   // --------------------------------
   // Handle value of `from` language
   // --------------------------------

   var from = data.translate.from;

   if (from !== "auto")
   {
      from = data.translate.from.valid[0].iso;
   }

   // ---------------
   // Get guild data
   // ---------------

   var guild = null;

   if (data.message.channel.type === "text")
   {
      guild = data.message.channel.guild;
   }

   // ----------------------------------------------
   // Translate multiple chains (!translate last n)
   // ----------------------------------------------

   if (data.bufferChains)
   {
      return bufferChains(data, from, guild);
   }

   // -----------------------------
   // Multi-translate same message
   // -----------------------------

   var translateBuffer = {};

   if (data.translate.multi && data.translate.to.valid.length > 1)
   {
      // ------------------------------------------
      // Stop if user requested too many languages
      // ------------------------------------------

      if (data.translate.to.valid.length > 6)
      {
         data.text = "Too many languages specified";
         data.color = "error";

         // -------------
         // Send message
         // -------------

         return botSend(data);
      }

      // --------------------
      // Buffer translations
      // --------------------

      const bufferID = data.message.createdTimestamp;

      data.color = null;

      data.text = "";

      translateBuffer[bufferID] = {
         count: 0,
         len: data.translate.to.valid.length,
         text: "",
         update: function(newMsg, data)
         {
            this.count++;
            this.text += newMsg;

            if (this.count === this.len)
            {
               data.text = this.text;
               data.color = data.message.roleColor;
               data.showAuthor = true;
               getUserColor(data, botSend);
            }
         }
      };

      data.translate.to.valid.forEach(lang =>
      {
         translate(data.translate.original, {
            to: lang.iso,
            from: from
         }).then(res =>
         {
         const langTo = res.raw[1][4][2]; // Language you set it to translate to when setting up !t channel command
         const detectedLang = res.from.language.iso; // Detected language from text
         const channelFrom = from; // Language you set when setting up !t channel command
         if (detectedLang === langTo)
         {
            return;
         } else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {
            return;
         }

            const title = `\`\`\`LESS\n ${lang.name} (${lang.native}) \`\`\`\n`;
            const output = "\n" + title + translateFix(res.text) + "\n";
            return translateBuffer[bufferID].update(output, data);
         });
      });
      return;
   }

   // ------------------------
   // Send single translation
   // ------------------------

   const opts = {
      to: data.translate.to.valid[0].iso,
      from: from
   };

   const fw = data.forward;
   const ft = data.footer;

   // --------------------
   // Split long messages
   // --------------------

   const textArray = fn.chunkString(data.translate.original, 1500);

   textArray.forEach(chunk =>
   {
      translate(chunk, opts).then(res =>
      {
         const langTo = res.raw[1][4][2]; // Language you set it to translate to when setting up !t channel command
         const detectedLang = res.from.language.iso; // Detected language from text
         const channelFrom = from; // Language you set when setting up !t channel command
         if (detectedLang === langTo)
         {
            return;
         } else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {
            return;
         }

         updateServerStats(data.message);
         data.forward = fw;
         data.footer = ft;
         data.color = data.message.roleColor;
         data.text = translateFix(res.text);
         data.showAuthor = true;
         return getUserColor(data, botSend);
      });
   });
   return;
};
