// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const sendMessage = require("../../core/command.send");

// ----
// Ban
// ----

module.exports.ban = function ban (data)
{

   // -------------
   // Command Code
   // -------------

   console.log("DEBUG: Ban");

   data.color = "info";
   data.text = `Ban`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// ------
// Unban
// ------

module.exports.unban = function unban (data)
{

   // -------------
   // Command Code
   // -------------

   console.log("DEBUG: Unban");

   data.color = "info";
   data.text = `Unban`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----
// Mute
// -----

module.exports.mute = function mute (data)
{

   // -------------
   // Command Code
   // -------------

   console.log("DEBUG: Mute");

   data.color = "info";
   data.text = `Mute`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -------
// Unmute
// -------

module.exports.unmute = function unmute (data)
{

   // -------------
   // Command Code
   // -------------

   console.log("DEBUG: Unmute");

   data.color = "info";
   data.text = `Unmute`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};
