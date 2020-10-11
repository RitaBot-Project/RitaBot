// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const botSend = require("../core/send");
const auth = require("../core/auth");

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
   console.log("----------------- Data -----------------");
   console.log(data);
   console.log("----------------- Data -----------------");

   // -------------
   // Send message
   // -------------

   botSend(data);
};
