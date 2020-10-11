// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING]
require("dotenv").config();
const discord = require("discord.js");
const client = new discord.Client();
const auth = require("./core/auth");

// ---------------
// Event Listener
// ---------------

const events = require("./events");

events.listen(client);

// ---------------
// Initialize Bot
// ---------------
login(auth.token);

function login(token)
{
   client.login(token).catch(err =>
   {
      console.log(err);
      console.log(`retrying login...`);
      setTimeout(login, 5000);
   });
}