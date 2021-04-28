// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const auth = require("../../core/auth");
const sendMessage = require("../../core/command.send");

// -------------
// Command Code
// -------------

module.exports = function run (data)
{

   let version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {

      version += ` ([changelog](${auth.changelog}))`;

   }

   data.color = "info";
   data.text = `:robot:  Current bot version is ${version}`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};
