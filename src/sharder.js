// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const discord = require("discord.js");
const auth = require("./core/auth");

// ------------------------
// Discord Main Bot Script
// ------------------------

const path = require("path");
const bot = path.join(
   __dirname,
   "bot.js"
);

// --------------
// Shard Manager
// --------------

let shards = 2;

if (auth.shards)
{

   shards = auth.shards;

}

const shardingOptions = {
   "totalShards": shards
};

const manager = new discord.ShardingManager(
   bot,
   shardingOptions
);

// -------------
// Spawn Shards
// -------------

manager.spawn().catch(console.error);
