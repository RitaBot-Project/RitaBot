// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const botSend = require("../core/send");

// ---------------------
// Supported Languages
// ---------------------

module.exports = function(data)
{
   const langList = [
      "Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani",
      "Basque","Belarusian","Bengali", "Bosnian","Bulgarian","Catalan",
      "Cebuano","Chichewa","Chinese Simplified (zh-cn)","Chinese Traditional (zh-tw)",
      "Corsican","Croatian","Czech","Danish","Dutch","English","Esperanto",
      "Estonian","Filipino","Finnish", "French","Frisian","Galician",
      "Georgian","German","Greek","Gujarati","Haitian Creole","Hausa",
      "Hawaiian", "Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo",
      "Indonesian","Irish","Italian","Japanese", "Javanese","Kannada",
      "Kazakh","Khmer","Korean","Kurdish (Kurmanji)","Kyrgyz","Lao",
      "Latin","Latvian","Lithuanian","Luxembourgish","Macedonian",
      "Malagasy","Malay","Malayalam","Maltese","Maori","Marathi",
      "Mongolian","Myanmar (Burmese)","Nepali","Norwegian","Pashto",
      "Persian","Polish","Portuguese","Punjabi", "Romanian","Russian",
      "Samoan","Scots Gaelic","Serbian","Sesotho","Shona","Sindhi",
      "Sinhala","Slovak", "Slovenian","Somali","Spanish","Sundanese",
      "Swahili","Swedish","Tajik","Tamil","Telugu","Thai","Turkish",
      "Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Xhosa","Yiddish",
      "Yoruba","Zulu"
   ];

   var output = "**```Supported Languages```**\n";

   langList.forEach(lang =>
   {
      var end = ",  ";
      if (lang === "Zulu")
      {
         end = ".";
      }
      output += "`" + lang + "`" + end;
   });

   data.color = "info";
   data.text = output;

   // -------------
   // Send message
   // -------------

   return botSend(data);
};
