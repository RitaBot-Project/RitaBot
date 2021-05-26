// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable sort-keys */
const translate = require("rita-google-translate-api");
const ISO6391 = require("iso-639-1");
const fn = require("./helpers");

// ----------------------------------
// Fix inconsistencies in lang codes
// ----------------------------------

const langExceptions =
{
   "he": "iw",
   "zh": "zh-CN",
   "ch": "zh-CN",
   "zh-cn": "zh-CN",
   "zh-tw": "zh-TW",
   "chinese traditional": "zh-TW",
   "chinese simplified": "zh-CN",
   "auto": "auto"
   // "chinese": "zh-CN"
};

const langInvertException = function langInvertException (code)
{

   const output = fn.getKeyByValue(
      langExceptions,
      code
   );

   if (output)
   {

      return output;

   }

   return code;

};

// -----------------------------
// Convert language name to ISO
// -----------------------------

const getLangISO = function getLangISO (lang)
{

   let code = null;

   if (!(/^[A-z]{2}[A-z]?(?:-[A-z]{2,}?)?$/i).test(lang))
   {

      code = ISO6391.getCode(lang);

   }

   else
   {

      code = lang;

   }

   if (Object.prototype.hasOwnProperty.call(
      langExceptions,
      code
   ))
   {

      return langExceptions[code];

   }

   return code;

};

// --------------------------------------
// Language Code Converter and Validator
// --------------------------------------

module.exports = function run (lang, single = false)
{

   if (!lang)
   {

      return null;

   }

   if (lang === "default")
   {

      return "default";

   }

   const langs = {
      "unchecked": fn.arraySplit(
         lang,
         ","
      ),
      "valid": [],
      "unique": [],
      "invalid": []
   };

   langs.unchecked.forEach((language) =>
   {

      // ----------------
      // Auto language
      // ----------------

      if (language.trim() === "auto")
      {

         langs.unique.push(language);
         langs.valid.push({"iso": language,
            "name": language,
            "native": language});

         return;

      }
      const langISO = getLangISO(language.trim());
      if (translate.languages.isSupported(langISO))
      {

         if (!langs.unique.includes(langISO))
         {

            langs.unique.push(langISO);
            langs.valid.push({
               "iso": langISO,
               "name": ISO6391.getName(langInvertException(langISO)),
               "native": ISO6391.getNativeName(langInvertException(langISO))
            });

         }

      }

      else
      {

         langs.invalid.push(language.trim());

      }

   });

   // Clean up

   langs.invalid = fn.removeDupes(langs.invalid);

   delete langs.unchecked;

   if (single)
   {

      return langs.unique[0];

   }

   return langs;

};
