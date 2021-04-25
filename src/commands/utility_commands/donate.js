// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]

const sendMessage = require("../../core/command.send");

// ------------------------------
// Donate varible command handalr
// ------------------------------

const donate = function donate (data)
{

   const commandVariable1 = data.cmd.params.split(" ")[0].toLowerCase();

   if (commandVariable1 === "github")
   {

      console.log(`DEBUG: donate ${commandVariable1}`);
      {

         const outputgh =
            "**```Donate via github```**\n" +
            `Thank you for wanting to donate to the RITA Bot Project \n` +
            `https://github.com/sponsors/RitaBot-Project\n\n`;
         data.color = "info";
         data.text = outputgh;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }
   else if (commandVariable1 === "oc")
   {

      console.log(`DEBUG: donate ${commandVariable1}`);
      {

         const outputoc =
          "**```Donate via Open Collective```**\n" +
          `Thank you for wanting to donate to the RITA Bot Project \n` +
          `https://opencollective.com/ritabot-project\n\n`;
         data.color = "info";
         data.text = outputoc;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

   }

   data.color = "error";
   data.text =
      `:warning:  **\`${commandVariable1
      }\`** is not a valid donate option.\n`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -------------
// Command Code
// -------------

module.exports = function run (data)

{

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      data.color = "info";
      data.text =
         "Thank you for wanting to donate to the RITA Bot Project \n" +
         "You can donate via the Open Collective \n" +
         `https://opencollective.com/ritabot-project\n\n` +
         "or via GitHub Sponsors \n" +
         `https://github.com/sponsors/RitaBot-Project\n\n` +
         "For more info on what we use the donations for check out \n" +
         `https://ritabot.gg/donate/\n\n`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return donate(data);

};


