
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const translate = require("rita-google-translate-api");
const db = require("./db");
const botSend = require("./send");
const fn = require("./helpers");

// ------------------------------------------
// Fix broken Discord tags after translation
// (Emojis, Mentions, Channels)
// ------------------------------------------


const translateFix = function translateFix (string)
{

   const normal = /(<[@#!$%&*])\s*/gim;
   const nick = /(<[@#!$%&*]!)\s*/gim;
   const role = /(<[@#!$%&*]&)\s*/gim;

   return string.replace(
      normal,
      "$1"
   ).
      replace(
         nick,
         "$1"
      ).
      replace(
         role,
         "$1"
      );

};

// ---------------------------------------
// Get user color for translated response
// ---------------------------------------

// eslint-disable-next-line func-style
function getUserColor (data, callback)
{

   const fw = data.forward;
   const txt = data.text;
   const ft = data.footer;
   const usr = data.author;
   const msg = data.message;

   data.forward = fw;
   data.text = txt;
   data.footer = ft;
   data.author = usr;
   data.message = msg;


   callback(data);

}


// --------------------------
// Translate buffered chains
// --------------------------

const bufferSend = function bufferSend (arr, data)
{

   const sorted = fn.sortByKey(
      arr,
      "time"
   );
   sorted.forEach((msg) =>
   {

      data.text = msg.text;
      data.color = msg.color;
      data.author = msg.author;
      data.showAuthor = true;
      data.message = msg;

      // -------------
      // Send message
      // -------------

      botSend(data);

   });

};

const bufferChains = function bufferChains (data, from)
{

   const translatedChains = [];

   data.bufferChains.forEach((chain) =>
   {

      const chainMsgs = chain.msgs.join("\n");
      const to = data.translate.to.valid[0].iso;

      translate(
         chainMsgs,
         {
            from,
            to
         }
      ).then((res) =>
      {

         // Language you set it to translate to when setting up !t channel command
         const langTo = res.raw[1][4][2];
         // Detected language from text
         const detectedLang = res.from.language.iso;
         // Language you set when setting up !t channel command
         const channelFrom = from;
         if (detectedLang === langTo)
         {

            return;

         }
         else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {

            return;

         }

         const output = translateFix(res.text);

         getUserColor(
            chain,
            function getUserColor (gotData)
            {

               translatedChains.push({
                  "author": gotData.author,
                  "color": gotData.color,
                  "text": output,
                  "time": chain.time
               });

               if (fn.bufferEnd(
                  data.bufferChains,
                  translatedChains
               ))
               {

                  bufferSend(
                     translatedChains,
                     data
                  );

               }

            }
         );

      });

   });

};

// ---------------------
// Invalid lang checker
// ---------------------

const invalidLangChecker = function invalidLangChecker (obj, callback)
{

   if (obj && obj.invalid && obj.invalid.length > 0)
   {

      return callback();

   }

};

// --------------------
// Update server stats
// --------------------

const updateServerStats = function updateServerStats (message)
{

   const col = "translation";
   let id = "bot";
   db.increaseStatsCount(col, id);

   if (message.channel.type === "text")
   {

      id = message.channel.guild.id;

   }
   db.increaseServersCount(id);
   db.increaseStatsCount(col, id);

};

// ----------------
// Run translation
// ----------------

module.exports = function run (data) // eslint-disable-line complexity
{

   // -------------------
   // Get message author
   // -------------------

   data.author = data.message.author;

   // -------------------------
   // Report invalid languages
   // -------------------------

   invalidLangChecker(
      data.translate.from,
      function invalidLangChecker ()
      {

         data.color = "warn";
         data.text = `:warning:  Cannot translate from \`${
            data.translate.from.invalid.join("`, `")}\`.`;

         // -------------
         // Send message
         // -------------

         botSend(data);

      }
   );

   invalidLangChecker(
      data.translate.to,
      function invalidLangChecker ()
      {

         data.color = "warn";
         data.text = `:warning:  Cannot translate to \`${
            data.translate.to.invalid.join("`, `")}\`.`;

         // -------------
         // Send message
         // -------------

         botSend(data);

      }
   );

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

   let from = data.translate.from;

   if (from !== "auto")
   {

      from = data.translate.from.valid[0].iso;

   }

   // ---------------
   // Get guild data
   // ---------------

   let guild = null;

   if (data.message.channel.type === "text")
   {

      guild = data.message.channel.guild;

   }

   // ----------------------------------------------
   // Translate multiple chains (!translate last n)
   // ----------------------------------------------

   if (data.bufferChains)
   {

      return bufferChains(
         data,
         from,
         guild
      );

   }

   // -----------------------------
   // Multi-translate same message
   // -----------------------------

   const translateBuffer = {};

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
         "count": 0,
         "len": data.translate.to.valid.length,
         "text": "",
         update (newMsg)
         {

            this.count += 1;
            this.text += newMsg;

            if (this.count === this.len)
            {

               data.text = this.text;
               data.color = data.message.roleColor;
               data.showAuthor = true;
               getUserColor(
                  data,
                  botSend
               );

            }

         }
      };

      data.translate.to.valid.forEach((lang) =>
      {

         translate(
            data.translate.original,
            {
               from,
               "to": lang.iso
            }
         ).then((res) =>
         {

            // Language you set it to translate to when setting up !t channel command
            const langTo = res.raw[1][4][2];
            // Detected language from text
            const detectedLang = res.from.language.iso;
            // Language you set when setting up !t channel command
            const channelFrom = from;
            if (detectedLang === langTo)
            {

               return;

            }
            else if (detectedLang !== channelFrom && channelFrom !== "auto")
            {

               return;

            }

            const title = `\`\`\`LESS\n ${lang.name} (${lang.native}) \`\`\`\n`;
            const output = `\n${title}${translateFix(res.text)}\n`;
            return translateBuffer[bufferID].update(
               output,
               data
            );

         });

      });
      return;

   }

   // ------------------------
   // Send single translation
   // ------------------------

   const opts = {
      from,
      "to": data.translate.to.valid[0].iso
   };

   const fw = data.forward;
   const ft = data.footer;

   // --------------------
   // Split long messages
   // --------------------

   const textArray = fn.chunkString(
      data.translate.original,
      1500
   );

   textArray.forEach((chunk) =>
   {

      translate(
         chunk,
         opts
      ).then((res) =>
      {

         // Language you set it to translate to when setting up !t channel command
         const langTo = res.raw[1][4][2];
         // Detected language from text
         const detectedLang = res.from.language.iso;
         // Language you set when setting up !t channel command
         const channelFrom = from;
         if (detectedLang === langTo)
         {

            return;

         }
         else if (detectedLang !== channelFrom && channelFrom !== "auto")
         {

            return;

         }

         updateServerStats(data.message);
         data.forward = fw;
         data.footer = ft;
         data.color = data.message.roleColor;
         data.text = translateFix(res.text);
         data.showAuthor = true;
         return getUserColor(
            data,
            botSend
         );

      });

   });

};
