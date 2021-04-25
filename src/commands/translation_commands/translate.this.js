// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const translate = require("../../core/translate");
const sendMessage = require("../../core/command.send");

// -----------------------------
// Translate string to language
// -----------------------------

module.exports = function(data)
{
   // -----------------------------
   // Send error for empty content
   // -----------------------------

   if (!data.cmd.content)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing content for translation.\n ```md\n" +
         "# Valid examples\n" +
         data.config.translateCmd + " this to french: Hello world\n" +
         data.config.translateCmd + " this to en from de: Wie geht's?\n" +
         data.config.translateCmd + " this to hebrew, arabic: I love you\n\n" +
         "# More help with this command\n> " +
         data.config.translateCmd + " help custom" +
         "```";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);
   }

   // ------------------
   // Start translation
   // ------------------

   data.translate = {
      original: data.cmd.content,
      to: data.cmd.to,
      from: data.cmd.from,
      multi: true
   };

   delete data.message.attachments;

   translate(data);
};