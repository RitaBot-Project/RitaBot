// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const sendMessage = require("../../core/command.send");

// -------------
// Command Code
// -------------
const channelName = function channelName (data)
{

   // Arguments to set the channel name
   const channelName = data.cmd.params.split(" ")[0].toLowerCase();

   data.message.guild.channels.create(channelName, {
      // This create a text channel, you can make a voice one too, by changing "text" to "voice"

      "type": "text"
   });

   data.color = "ok";
   data.text =
   "**```New channel has been created```**\n" +
   `Your new channel is **\`${channelName}\`**.`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   Override: if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (data.message.isManager === false)
      {

         {

            data.color = "warn";

         }
         data.text =
         ":police_officer:  You need to be a channel manager to " +
         "create a new channel";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }
      break Override;

   }

   // --------------------------------
   // Error if create param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `create` parameter. Use `" +
         `${data.config.translateCmdShort} help create\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }
   // ----------------
   // Execute setting
   // ----------------

   return channelName(data);

};
