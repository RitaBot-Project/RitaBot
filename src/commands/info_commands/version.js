// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const auth = require("../../core/auth");
const sendMessage = require("../../core/command.send");

// -------------
// Command Code
// -------------

module.exports = function(data)
{
   var version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {
      version += ` ([changelog](${auth.changelog}))`;
   }

   data.color = "info";
   data.text = `:robot:  Current bot version is ${version}`;
   //console.log("----------------- Data -----------------");
   //console.log(data);
   //console.log("----------------- Data -----------------");

   // -------------
   // Send message
   // -------------

   return sendMessage(data);
};