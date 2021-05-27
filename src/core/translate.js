
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
// (Emojis, Mentions, Channels, Urls)
// ------------------------------------------


function discordPatch (string)
{

   // eslint-disable-next-line no-useless-escape
   const urlRegex = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/giu;

   // let regexFix = string.replace(/:[^\s]*?:/gmi);

   let match = string.match(/<.*?>/gmiu);
   let everyonePing = string.match(/@everyone|@here/giu);
   let urlMatch = string.match(urlRegex);

   const regexFix = string.replace(/<.*?>/gmiu, "<>").
      replace(urlRegex, "{}").
      replace(/@everyone/g, "[]").
      replace(/@here/g, "[]");
   if (!urlMatch)
   {

      urlMatch = [];

   }

   if (!everyonePing)
   {

      everyonePing = [];

   }
   if (!match)
   {

      match = [];

   }
   for (let i = 0; i < match.length; i += 1)
   {

      const str = match[i];
      if (!str.match(/<:.*?:([0-9])>/))
      {

         const text = str.slice(1, -1);
         const textMatch = text.match(/[a-z\s.!,()0-9]/gi);
         if (textMatch.length === text.length)
         {

            match[i] = text;

         }

      }


   }
   const result = {
      match,
      "text": regexFix,
      // eslint-disable-next-line sort-keys
      "original": string,
      "url": urlMatch,
      // eslint-disable-next-line sort-keys
      "memberPing": everyonePing


   };
   return result;

}


const translateFix = function translateFix (string, matches)
{

   let text = string;

   for (const obj of matches.match)
   {

      text = text.replace(/<\s*?>/i, obj);

   }
   for (const obj of matches.url)
   {

      text = text.replace(/{\s*?}/i, obj);

   }
   for (const obj of matches.memberPing)
   {

      text = text.replace(/\[\s*?\]/i, obj);

   }
   return text;


};
// ------------
// Retranslation function using auto if it thinks it is in the wrong language
// ------------
async function reTranslate (matches, opts)
{

   const OPTIONS = {
      "from": "auto",
      "to": opts.to


   };
   const res = await translate(matches.text, OPTIONS);
   return translateFix(res.text, matches);

}

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

   data.bufferChains.forEach(async (chain) =>
   {

      const chainMsgs = chain.msgs.join("\n");
      const to = data.translate.to.valid[0].iso;
      const matches = await discordPatch(chainMsgs);

      translate(
         matches.text,
         {
            from,
            to
         }
      ).then((res) =>
      {


         // Language you set it to translate to when setting up !t channel command
         const langTo = to;

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

         const output = translateFix(res.text, matches);

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

      data.translate.to.valid.forEach(async (lang) =>
      {

         const matches = await discordPatch(data.translate.original);
         translate(
            matches.text,
            {
               from,
               "to": lang.iso
            }
         ).then((res) =>
         {

            // Language you set it to translate to when setting up !t channel command
            const langTo = lang.iso;

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
            const output = `\n${title}${translateFix(res.text, matches)}\n`;
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

   textArray.forEach(async (chunk) =>
   {

      const matches = await discordPatch(chunk);
      translate(
         matches.text,
         opts
      ).then(async (res) =>
      {

         res.text = translateFix(res.text, matches);


         const langTo = opts.to;

         // Detected language from text
         const detectedLang = res.from.language.iso;
         // Language you set when setting up !t channel command
         const channelFrom = from;

         if (detectedLang === langTo || detectedLang !== channelFrom && channelFrom !== "auto")
         {

            // eslint-disable-next-line require-atomic-updates
            res.text = await reTranslate(matches, opts);


         }


         updateServerStats(data.message);
         data.forward = fw;
         data.footer = ft;
         data.color = data.message.roleColor;
         data.text = res.text;
         data.showAuthor = true;
         return getUserColor(
            data,
            botSend
         );

      });

   });

};
