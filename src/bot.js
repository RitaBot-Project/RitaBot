// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const env = `${__dirname.slice(
   0,
   -3
)}.env`;
require("dotenv").config({
   "path": env
});
const discord = require("discord.js");
const client = new discord.Client();
const auth = require("./core/auth");

// ---------------
// Event Listener
// ---------------
const events = require("./events");

events.listen(client);
exports.client = client;
// ---------------
// Initialize Bot
// ---------------


// eslint-disable-next-line func-style
function login (token)
{

   client.login(token).catch((err) =>
   {

      console.log(err);
      console.log(`retrying login...`);
      setTimeout(
         login,
         5000
      );

   });

}

login(auth.token);
